from ml.source_analysis.source_features import SourceFeatureExtractor


class PollutionSourceClassifier:
    """
    Rule-based probable pollution source classifier.

    Categories:
        TRAFFIC
        BIOMASS_BURNING
        INDUSTRIAL
        DUST
        MIXED_OR_UNCERTAIN

    IMPORTANT:
    This is a prototype heuristic system.

    It does NOT establish definitive causation or
    identify the actual pollution source with certainty.
    """

    def __init__(self):

        self.feature_extractor = SourceFeatureExtractor()

        self.source_categories = [
            "TRAFFIC",
            "BIOMASS_BURNING",
            "INDUSTRIAL",
            "DUST",
            "MIXED_OR_UNCERTAIN"
        ]

    def classify(self, event):
        """
        Classify the probable pollution source category.
        """

        features = self.feature_extractor.extract(event)

        scores = {
            "TRAFFIC": 0.0,
            "BIOMASS_BURNING": 0.0,
            "INDUSTRIAL": 0.0,
            "DUST": 0.0,
            "MIXED_OR_UNCERTAIN": 0.0
        }

        pm25 = features["pm25_intensity"]
        wind_speed = features["wind_speed"]
        moisture = features["moisture_signal"]
        temperature = features["temperature_signal"]
        traffic = features["traffic_score"]
        biomass = features["biomass_score"]

        # -------------------------------
        # Traffic indicators
        # -------------------------------

        scores["TRAFFIC"] += traffic * 0.40
        scores["TRAFFIC"] += pm25 * 0.25

        if wind_speed < 8:
            scores["TRAFFIC"] += 0.15

        # -------------------------------
        # Biomass burning indicators
        # -------------------------------

        scores["BIOMASS_BURNING"] += biomass * 0.35
        scores["BIOMASS_BURNING"] += pm25 * 0.30

        if wind_speed < 10:
            scores["BIOMASS_BURNING"] += 0.10

        # -------------------------------
        # Industrial indicators
        # -------------------------------

        scores["INDUSTRIAL"] += pm25 * 0.45
        scores["INDUSTRIAL"] += (1.0 - moisture) * 0.15

        if wind_speed > 5:
            scores["INDUSTRIAL"] += 0.10

        # -------------------------------
        # Dust indicators
        # -------------------------------

        scores["DUST"] += temperature * 0.20
        scores["DUST"] += pm25 * 0.30

        if wind_speed >= 10:
            scores["DUST"] += 0.30

        # -------------------------------
        # Normalize scores
        # -------------------------------

        total = sum(scores.values())

        if total <= 0:

            normalized = {
                key: 0.0
                for key in scores
            }

        else:

            normalized = {
                key: value / total
                for key, value in scores.items()
            }

        # -------------------------------
        # Find top categories
        # -------------------------------

        sorted_scores = sorted(
            normalized.items(),
            key=lambda item: item[1],
            reverse=True
        )

        top_source = sorted_scores[0][0]

        top_score = sorted_scores[0][1]

        second_score = (
            sorted_scores[1][1]
            if len(sorted_scores) > 1
            else 0.0
        )

        # -------------------------------
        # Confidence logic
        # -------------------------------

        if (
            top_score < 0.35
            or (top_score - second_score) < 0.05
        ):

            source = "MIXED_OR_UNCERTAIN"

            confidence = 0.40

        else:

            source = top_source

            confidence = min(
                0.95,
                max(0.40, top_score)
            )

        return {
            "probable_source": source,

            "source_confidence":
                round(confidence, 3),

            "source_scores": {
                key: round(value, 3)
                for key, value in normalized.items()
            },

            "supporting_features": features
        }