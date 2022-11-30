package com.inf5190.chat.messages.repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Bucket.BlobTargetOption;
import com.google.cloud.storage.Storage.PredefinedAcl;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.MessageRequest;

import io.jsonwebtoken.io.Decoders;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;
import org.springframework.web.server.ResponseStatusException;

@Repository
public class MessageRepository {
    private static final String COLLECTION_NAME = "chatMessages";
    private static final String BUCKET_NAME = "inf5190-chat-1b58a.appspot.com";
    private static final String IMAGE_PATH_FORMAT = "images/%s.%s";
    private static final String IMAGE_URL_FORMAT = "https://storage.googleapis.com/%s/%s";
    private static final int DOCUMENT_LIMIT = 20;

    private Firestore firestore = FirestoreClient.getFirestore();

    public List<Message> getMessages(Optional<String> fromId) throws InterruptedException, ExecutionException {
        Query query = this.firestore.collection(COLLECTION_NAME)
                .orderBy("timestamp");

        if (fromId.isPresent()) {
            DocumentSnapshot snapshot = this.firestore.collection(COLLECTION_NAME)
                    .document(fromId.get()).get()
                    .get();

            if (!snapshot.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }

            query = query.startAfter(snapshot);
        } else {
            query = query.limitToLast(DOCUMENT_LIMIT);
        }

        ApiFuture<QuerySnapshot> querySnapshotFuture = query.get();

        return querySnapshotFuture.get().getDocuments().stream().map(doc -> this.toMessage(doc))
                .collect(Collectors.toList());
    }

    public Message createMessage(MessageRequest messageRequest) throws InterruptedException, ExecutionException {
        DocumentReference ref = this.firestore.collection(COLLECTION_NAME).document();

        String imageUrl = null;
        if (messageRequest.imageData() != null) {
            Bucket b = StorageClient.getInstance().bucket(BUCKET_NAME);
            String path = String.format(IMAGE_PATH_FORMAT, ref.getId(), messageRequest.imageData().type());
            b.create(path, Decoders.BASE64.decode(messageRequest.imageData().data()),
                    BlobTargetOption.predefinedAcl(PredefinedAcl.PUBLIC_READ));
            imageUrl = String.format(IMAGE_URL_FORMAT, BUCKET_NAME, path);
        }

        FirestoreMessage firestoreMessage = new FirestoreMessage(
                messageRequest.username(),
                Timestamp.now(),
                messageRequest.text(),
                imageUrl);

        ref.create(firestoreMessage).get();

        return this.toMessage(ref.getId(), firestoreMessage);
    }

    private Message toMessage(QueryDocumentSnapshot snapshot) {
        FirestoreMessage firestoreMessage = snapshot.toObject(FirestoreMessage.class);
        return this.toMessage(snapshot.getId(), firestoreMessage);
    }

    private Message toMessage(String id, FirestoreMessage firestoreMessage) {
        return new Message(id, firestoreMessage.getUsername(),
                firestoreMessage.getTimestamp().toDate().getTime(), firestoreMessage.getText(),
                firestoreMessage.getImageUrl());
    }

}
