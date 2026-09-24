from pprint import pprint

from ml.integration.airshield_ai import (
    AirShieldAI
)


def main():

    print("\n==========================================")
    print("          AIRSHIELD AI ENGINE")
    print("==========================================")

    # ==================================
    # Demo pollution event
    # ==================================

    event = {

        "event_id":
            "AS-DEMO-001",

        "latitude":
            10.98,

        "longitude":
            76.95,

        # Current PM2.5
        "pm25":
            142,

        # Beijing dataset features
        "DEWP":
            20,

        "TEMP":
            30,

        "PRES":
            1008,

        "Iws":
            12,

        "Is":
            0,

        "Ir":
            0,

        "hour":
            14,

        "month":
            9,

        # Wind category for forecasting/source analysis
        "wind_direction":
            "NW",

        # Wind values for trajectory
        "wind_speed":
            12,

        "wind_direction_degrees":
            315,

        # Trajectory configuration
        "duration_minutes":
            120,

        "interval_minutes":
            15
    }

    # ==================================
    # Population
    # ==================================

    population = {

        "density_per_km2":
            5000
    }

    # ==================================
    # Schools
    # ==================================

    schools = [

        {

            "id":
                "SCH-001",

            "name":
                "Sample School A",

            "latitude":
                11.02,

            "longitude":
                76.88
        },

        {

            "id":
                "SCH-002",

            "name":
                "Sample School B",

            "latitude":
                10.95,

            "longitude":
                76.90
        }
    ]

    # ==================================
    # Hospitals
    # ==================================

    hospitals = [

        {

            "id":
                "HOS-001",

            "name":
                "Sample Hospital A",

            "latitude":
                11.01,

            "longitude":
                76.89
        }
    ]

    # ==================================
    # Initialize AI engine
    # ==================================

    ai = AirShieldAI()

    # ==================================
    # Execute complete pipeline
    # ==================================

    result = ai.analyze(

        event=event,

        population=population,

        schools=schools,

        hospitals=hospitals
    )

    # ==================================
    # Display result
    # ==================================

    print("\n==========================================")

    print(
        "              AIRSHIELD RESULT"
    )

    print("==========================================")

    print("\nEvent ID:")

    print(
        result["event_id"]
    )

    print("\nPredicted PM2.5:")

    print(
        result["predicted_pm25"]
    )

    print("\nRisk:")

    print(
        result["risk"]
    )

    print("\nRisk score:")

    print(
        result["risk_score"]
    )

    print("\nForecast horizon:")

    print(
        result["forecast_horizon"]
    )

    print("\nProbable source:")

    print(
        result["probable_source"]
    )

    print("\nSource confidence:")

    print(
        result["source_confidence"]
    )

    print("\nSource scores:")

    pprint(
        result["source_scores"]
    )

    print("\nTrajectory points:")

    print(
        len(result["trajectory"])
    )

    print("\nPlume points:")

    print(
        len(result["plume"])
    )

    print("\nExposure:")

    pprint(
        result["exposure"]
    )

    print("\n==========================================")

    print(
        "        COMPLETE AI PIPELINE READY"
    )

    print("==========================================\n")


if __name__ == "__main__":
    main()