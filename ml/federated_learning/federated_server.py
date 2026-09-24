import numpy as np


class FederatedServer:
    """
    AirShield federated learning server.

    Aggregates model parameters from regional
    clients using weighted averaging.

    This demonstrates the core idea of FedAvg.
    """

    def __init__(
        self,
        feature_count
    ):

        self.feature_count = int(
            feature_count
        )

        self.global_weights = np.zeros(
            self.feature_count,
            dtype=float
        )

        self.global_bias = 0.0

    def aggregate(
        self,
        client_parameters,
        client_sizes=None
    ):
        """
        Perform weighted parameter aggregation.

        Larger datasets receive proportionally
        larger aggregation weights.
        """

        if not client_parameters:

            raise ValueError(
                "No client parameters provided."
            )

        if client_sizes is None:

            client_sizes = [
                1
                for _ in client_parameters
            ]

        if len(client_sizes) != len(
            client_parameters
        ):

            raise ValueError(
                "client_sizes must match "
                "client_parameters."
            )

        total_size = sum(
            client_sizes
        )

        if total_size <= 0:

            raise ValueError(
                "Total client size must "
                "be positive."
            )

        weighted_weights = np.zeros(
            self.feature_count,
            dtype=float
        )

        weighted_bias = 0.0

        for parameters, size in zip(
            client_parameters,
            client_sizes
        ):

            if size <= 0:

                raise ValueError(
                    "Client size must "
                    "be positive."
                )

            weight = (
                float(size)
                / total_size
            )

            client_weights = np.asarray(
                parameters["weights"],
                dtype=float
            )

            if len(client_weights) != (
                self.feature_count
            ):

                raise ValueError(
                    "Client feature count "
                    "does not match server."
                )

            weighted_weights += (
                weight
                * client_weights
            )

            weighted_bias += (
                weight
                * float(
                    parameters["bias"]
                )
            )

        self.global_weights = (
            weighted_weights
        )

        self.global_bias = (
            weighted_bias
        )

        return self.get_global_parameters()

    def get_global_parameters(self):
        """
        Return the current global model parameters.
        """

        return {

            "weights":
                self.global_weights.copy(),

            "bias":
                float(self.global_bias)
        }