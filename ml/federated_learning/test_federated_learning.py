import numpy as np

from ml.federated_learning.federated_client import (
    FederatedClient
)

from ml.federated_learning.federated_server import (
    FederatedServer
)


def main():

    print("\n======================================")
    print("     AIRSHIELD FEDERATED LEARNING")
    print("======================================")

    # ----------------------------------
    # Configuration
    # ----------------------------------

    feature_count = 3

    np.random.seed(42)

    # ----------------------------------
    # Simulated regional datasets
    # ----------------------------------

    nodes = {

        "INDIA": (
            np.random.rand(
                30,
                feature_count
            ),

            np.random.rand(30) * 100
        ),

        "BRAZIL": (
            np.random.rand(
                25,
                feature_count
            ),

            np.random.rand(25) * 100
        ),

        "RUSSIA": (
            np.random.rand(
                20,
                feature_count
            ),

            np.random.rand(20) * 100
        ),

        "CHINA": (
            np.random.rand(
                35,
                feature_count
            ),

            np.random.rand(35) * 100
        ),

        "SOUTH_AFRICA": (
            np.random.rand(
                22,
                feature_count
            ),

            np.random.rand(22) * 100
        )
    }

    # ----------------------------------
    # Federated server
    # ----------------------------------

    server = FederatedServer(
        feature_count
    )

    client_parameters = []

    client_sizes = []

    # ----------------------------------
    # Local training
    # ----------------------------------

    for country, data in nodes.items():

        X, y = data

        client = FederatedClient(

            client_id=country,

            feature_count=feature_count
        )

        parameters = client.train_local(

            X,

            y,

            learning_rate=0.0001,

            epochs=5
        )

        client_parameters.append(
            parameters
        )

        client_sizes.append(
            len(X)
        )

        print(
            f"\n{country}:"
        )

        print(
            f"  Local samples: {len(X)}"
        )

        print(
            "  Local model update generated."
        )

    # ----------------------------------
    # Global aggregation
    # ----------------------------------

    global_parameters = (
        server.aggregate(

            client_parameters,

            client_sizes
        )
    )

    print("\n======================================")

    print(
        "       GLOBAL MODEL UPDATE"
    )

    print("======================================")

    print(
        "Global weights:"
    )

    print(
        global_parameters[
            "weights"
        ]
    )

    print(
        "\nGlobal bias:"
    )

    print(
        round(
            global_parameters["bias"],
            6
        )
    )

    print("\n======================================")

    print(
        "Federated learning round completed."
    )

    print(
        "Raw regional data remained local."
    )

    print("======================================\n")


if __name__ == "__main__":
    main()