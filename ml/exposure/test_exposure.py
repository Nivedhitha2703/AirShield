from ml.trajectory.trajectory_model import (
    TrajectoryModel
)

from ml.trajectory.plume_simulator import (
    PlumeSimulator
)

from ml.exposure.exposure_model import (
    ExposureModel
)


def main():

    print("\n======================================")
    print("      AIRSHIELD EXPOSURE TEST")
    print("======================================")

    # ----------------------------------
    # Generate trajectory
    # ----------------------------------

    trajectory_model = TrajectoryModel()

    trajectory = (
        trajectory_model.generate_trajectory(

            latitude=10.98,

            longitude=76.95,

            wind_speed=12,

            wind_direction=315,

            duration_minutes=120,

            interval_minutes=15
        )
    )

    # ----------------------------------
    # Generate plume
    # ----------------------------------

    plume_model = PlumeSimulator()

    plume = (
        plume_model.generate_plume(
            trajectory
        )
    )

    # ----------------------------------
    # Population information
    # ----------------------------------

    population = {

        "density_per_km2": 5000
    }

    # ----------------------------------
    # Schools
    # ----------------------------------

    schools = [

        {
            "id": "SCH-001",

            "name": "Sample School A",

            "latitude": 11.02,

            "longitude": 76.88
        },

        {
            "id": "SCH-002",

            "name": "Sample School B",

            "latitude": 10.95,

            "longitude": 76.90
        }
    ]

    # ----------------------------------
    # Hospitals
    # ----------------------------------

    hospitals = [

        {
            "id": "HOS-001",

            "name": "Sample Hospital A",

            "latitude": 11.01,

            "longitude": 76.89
        }
    ]

    # ----------------------------------
    # Analyze exposure
    # ----------------------------------

    model = ExposureModel()

    result = model.analyze(

        plume=plume,

        risk_level="UNHEALTHY",

        population=population,

        schools=schools,

        hospitals=hospitals
    )

    # ----------------------------------
    # Display results
    # ----------------------------------

    print("\nExposure level:")

    print(
        result["exposure_level"]
    )

    print(
        "\nEstimated exposed population:"
    )

    print(
        result[
            "estimated_exposed_population"
        ]
    )

    print("\nAffected schools:")

    print(
        result["school_count"]
    )

    for school in result[
        "affected_schools"
    ]:

        print(
            f"  - {school['name']} "
            f"({school['predicted_arrival_minutes']} min)"
        )

    print("\nAffected hospitals:")

    print(
        result["hospital_count"]
    )

    for hospital in result[
        "affected_hospitals"
    ]:

        print(
            f"  - {hospital['name']} "
            f"({hospital['predicted_arrival_minutes']} min)"
        )

    print("\n======================================")

    print(
        "Exposure analysis completed."
    )

    print("======================================\n")


if __name__ == "__main__":
    main()