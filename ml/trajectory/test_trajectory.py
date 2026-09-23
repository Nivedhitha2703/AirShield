from ml.trajectory.trajectory_model import (
    TrajectoryModel
)

from ml.trajectory.plume_simulator import (
    PlumeSimulator
)


def main():

    print("\n")
    print("==============================================")
    print("       AIRSHIELD TRAJECTORY TEST")
    print("==============================================")

    # --------------------------------------------------------
    # Example pollution event
    # --------------------------------------------------------

    event = {

        "event_id": "AS-TRAJ-001",

        "latitude": 10.98,

        "longitude": 76.95,

        "wind_speed": 12,

        "wind_direction": 315,

        "duration_minutes": 120,

        "interval_minutes": 15

    }

    print("\nEvent ID:")
    print(event["event_id"])

    print("\nSource location:")
    print(
        f"Latitude  : {event['latitude']}"
    )
    print(
        f"Longitude : {event['longitude']}"
    )

    print("\nWind conditions:")
    print(
        f"Wind speed      : "
        f"{event['wind_speed']} km/h"
    )

    print(
        f"Wind direction  : "
        f"{event['wind_direction']}°"
    )

    # --------------------------------------------------------
    # Generate trajectory
    # --------------------------------------------------------

    trajectory_model = TrajectoryModel()

    trajectory = (
        trajectory_model.generate_trajectory(

            latitude=event["latitude"],

            longitude=event["longitude"],

            wind_speed=event["wind_speed"],

            wind_direction=event["wind_direction"],

            duration_minutes=event[
                "duration_minutes"
            ],

            interval_minutes=event[
                "interval_minutes"
            ]
        )
    )

    print("\n==============================================")
    print("          PREDICTED TRAJECTORY")
    print("==============================================")

    for point in trajectory:

        print(
            f"{point['time_minutes']:3d} min | "
            f"Lat: {point['latitude']} | "
            f"Lon: {point['longitude']}"
        )

    # --------------------------------------------------------
    # Generate plume
    # --------------------------------------------------------

    plume_model = PlumeSimulator()

    plume = plume_model.generate_plume(
        trajectory
    )

    print("\n==============================================")
    print("          PREDICTED POLLUTION PLUME")
    print("==============================================")

    for point in plume:

        print(
            f"{point['time_minutes']:3d} min | "
            f"Distance: "
            f"{point['distance_from_source_km']:.3f} km | "
            f"Width: "
            f"{point['estimated_width_km']:.3f} km"
        )

    # --------------------------------------------------------
    # Final result
    # --------------------------------------------------------

    print("\n==============================================")
    print("              TRAJECTORY SUMMARY")
    print("==============================================")

    print(
        f"Total trajectory points : "
        f"{len(trajectory)}"
    )

    print(
        f"Forecast duration       : "
        f"{event['duration_minutes']} minutes"
    )

    if plume:

        final_point = plume[-1]

        print(
            f"Final distance          : "
            f"{final_point['distance_from_source_km']:.3f} km"
        )

        print(
            f"Final plume width       : "
            f"{final_point['estimated_width_km']:.3f} km"
        )

    print("\nTrajectory module test completed.")

    print("==============================================\n")


if __name__ == "__main__":
    main()