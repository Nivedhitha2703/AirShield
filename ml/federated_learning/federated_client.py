import numpy as np


class FederatedClient:
    """
    AirShield federated learning client.

    Each client represents a regional node.

    Raw training data remains local to the client.
    Only model parameters are sent to the server.
    """

    def __init__(
        self,
        client_id,
        feature_count
    ):

        self.client_id = client_id

        self.feature_count = int(
            feature_count
        )

        self.weights = np.zeros(
            self.feature_count,
            dtype=float
        )

        self.bias = 0.0

    def train_local(
        self,
        X,
        y,
        learning_rate=0.001,
        epochs=10
    ):
        """
        Perform lightweight local gradient-descent
        training.

        Returns local model parameters.
        """

        X = np.asarray(
            X,
            dtype=float
        )

        y = np.asarray(
            y,
            dtype=float
        )

        if X.ndim != 2:

            raise ValueError(
                "X must be a 2D array."
            )

        if X.shape[1] != self.feature_count:

            raise ValueError(
                "Feature count does not "
                "match client model."
            )

        if len(X) == 0:

            raise ValueError(
                "Training data cannot be empty."
            )

        for _ in range(epochs):

            predictions = (
                X @ self.weights
                + self.bias
            )

            error = (
                predictions - y
            )

            gradient_weights = (
                X.T @ error
            ) / len(X)

            gradient_bias = np.mean(
                error
            )

            self.weights -= (
                learning_rate
                * gradient_weights
            )

            self.bias -= (
                learning_rate
                * gradient_bias
            )

        return self.get_parameters()

    def get_parameters(self):
        """
        Return local model parameters.
        """

        return {

            "client_id":
                self.client_id,

            "weights":
                self.weights.copy(),

            "bias":
                float(self.bias)
        }

    def set_parameters(
        self,
        parameters
    ):
        """
        Update local model using global parameters.
        """

        weights = np.asarray(
            parameters["weights"],
            dtype=float
        )

        if len(weights) != self.feature_count:

            raise ValueError(
                "Parameter feature count "
                "does not match client model."
            )

        self.weights = weights.copy()

        self.bias = float(
            parameters["bias"]
        )