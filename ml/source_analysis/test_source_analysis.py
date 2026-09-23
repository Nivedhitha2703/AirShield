from ml.source_analysis.source_classifier import (
    PollutionSourceClassifier
)


def main():

    print("\n======================================")
    print("     AIRSHIELD SOURCE ANALYSIS")
    print("======================================")

    event = {
        "event_id": "AS-SOURCE-001",

        "pm25": 142,

        "DEWP": 20,

        "TEMP": 30,

        "PRES": 1008,

        "Iws": 12,

        "Is": 0,

        "Ir": 0,

        "hour": 14,

        "month": 9,

        "wind_direction": 315
    }

    classifier = PollutionSourceClassifier()

    result = classifier.classify(event)

    print("\nProbable source category:")

    print(
        result["probable_source"]
    )

    print("\nSource confidence:")

    print(
        result["source_confidence"]
    )

    print("\nSource category scores:")

    for source, score in result[
        "source_scores"
    ].items():

        print(
            f"{source:25s}: {score:.3f}"
        )

    print("\nSupporting signals:")

    for key, value in result[
        "supporting_features"
    ].items():

        print(
            f"{key:20s}: {value}"
        )

    print("\n======================================")

    print(
        "Source analysis completed."
    )

    print("======================================\n")


if __name__ == "__main__":
    main()