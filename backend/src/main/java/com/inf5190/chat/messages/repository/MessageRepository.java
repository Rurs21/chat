package com.inf5190.chat.messages.repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;

import com.inf5190.chat.messages.model.Message;
/**
 * Classe qui gère la persistence des messages.
 *
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {

    private static final String COLLECTION_NAME = "chatMessages";
    private static final int MESSAGES_LIMIT = 20;

    private final Firestore firestore = FirestoreClient.getFirestore();



    public List<Message> getMessages(Optional<String> fromId) throws ExecutionException, InterruptedException {
        final CollectionReference collectionRef = firestore.collection(COLLECTION_NAME);

        ApiFuture<QuerySnapshot> getFuture;

        if (fromId.isPresent()) {
            DocumentSnapshot messageFromId = collectionRef.document(fromId.get()).get().get();
            getFuture = collectionRef.orderBy("timestamp").startAfter(messageFromId).get();
        } else {
            getFuture = collectionRef.orderBy("timestamp").limit(MESSAGES_LIMIT).get();
        }

        final QuerySnapshot messagesSnapshot = getFuture.get();
        if (messagesSnapshot.size() > 0) {
            return messagesSnapshot.getDocuments().stream()
                    .map(document -> {
                        FirestoreMessage storeMessage = document.toObject(FirestoreMessage.class);
                        return new Message(document.getId(),
                                storeMessage.getUsername(),
                                storeMessage.getTimestamp().getSeconds(),
                                storeMessage.getText());
                    }).collect(Collectors.toList());
        } else {
            return null;
        }
    }

    public Message createMessage(FirestoreMessage message) throws InterruptedException, ExecutionException {
        final CollectionReference collectionRef = firestore.collection(COLLECTION_NAME);

        final DocumentReference docRef = collectionRef.document();

        final ApiFuture<WriteResult> apiFuture = docRef.create(message);

        final WriteResult result = apiFuture.get();
        System.out.println("Operation timestamp: " + result.getUpdateTime().toDate().getTime());

        final Message newMessage = new Message(docRef.getId(), message.getUsername(), message.getTimestamp().getSeconds(), message.getText());

        return newMessage;
    }
}
