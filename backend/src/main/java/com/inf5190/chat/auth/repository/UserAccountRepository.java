package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.stereotype.Repository;

import com.google.firebase.cloud.FirestoreClient;

@Repository
public class UserAccountRepository {
    private static final String COLLECTION_NAME = "userAccounts";

    private final Firestore firestore = FirestoreClient.getFirestore();

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        final CollectionReference collectionRef = firestore.collection(COLLECTION_NAME);

        final ApiFuture<DocumentSnapshot> getFuture = collectionRef.document(username).get();
        final DocumentSnapshot userSnapshot = getFuture.get();

        if (userSnapshot.exists())
            return userSnapshot.toObject(FirestoreUserAccount.class);
        else
            return null;
    }

    public void setUserAccount(FirestoreUserAccount userAccount) throws InterruptedException, ExecutionException {
        final CollectionReference collectionRef = firestore.collection(COLLECTION_NAME);

        final DocumentReference docRef = collectionRef.document(userAccount.getUsername());

        final ApiFuture<WriteResult> apiFuture = docRef.create(userAccount);

        final WriteResult result = apiFuture.get();
        System.out.println("Operation timestamp: " + result.getUpdateTime().toDate().getTime());
    }
}