import math


class TrajectoryModel:
    """
    AirShield Pollution Trajectory Model.

    Estimates the movement of a pollution plume using:
    - source latitude
    - source longitude
    - wind speed
    - wind direction
    - forecast duration

    This is a simplified atmospheric transport prototype.
    It is NOT a full atmospheric dispersion model.
    """

    def __init__(self):

        # Mean Earth radius
        self.earth_radius_km = 6371.0

        # Fraction of wind speed assumed to contribute
        # to horizontal pollution transport.
        self.transport_factor = 0.6

    # ========================================================
    # DESTINATION CALCULATION
    # ========================================================

    def destination(
        self,
        latitude,
        longitude,
        distance_km,
        bearing_degrees
    ):
        """
        Calculate destination coordinates after moving
        a given distance along a given bearing.

        Parameters
        ----------
        latitude : float
            Starting latitude.

        longitude : float
            Starting longitude.

        distance_km : float
            Distance travelled in kilometres.

        bearing_degrees : float
            Direction of movement in degrees.

            0   = North
            90  = East
            180 = South
            270 = West
        """

        lat1 = math.radians(latitude)
        lon1 = math.radians(longitude)

        bearing = math.radians(
            bearing_degrees
        )

        angular_distance = (
            distance_km /
            self.earth_radius_km
        )

        lat2 = math.asin(
            math.sin(lat1)
            * math.cos(angular_distance)
            +
            math.cos(lat1)
            * math.sin(angular_distance)
            * math.cos(bearing)
        )

        lon2 = (
            lon1
            +
            math.atan2(
                math.sin(bearing)
                * math.sin(angular_distance)
                * math.cos(lat1),

                math.cos(angular_distance)
                -
                math.sin(lat1)
                * math.sin(lat2)
            )
        )

        return (
            math.degrees(lat2),
            math.degrees(lon2)
        )

    # ========================================================
    # TRAJECTORY GENERATION
    # ========================================================

    def generate_trajectory(
        self,
        latitude,
        longitude,
        wind_speed,
        wind_direction,
        duration_minutes=120,
        interval_minutes=15
    ):
        """
        Generate a predicted pollution trajectory.

        Returns a list of geographic points.
        """

        points = []

        current_latitude = float(
            latitude
        )

        current_longitude = float(
            longitude
        )

        wind_speed = max(
            0.0,
            float(wind_speed)
        )

        wind_direction = float(
            wind_direction
        )

        duration_minutes = int(
            duration_minutes
        )

        interval_minutes = int(
            interval_minutes
        )

        if interval_minutes <= 0:

            raise ValueError(
                "interval_minutes must be greater than 0"
            )

        if duration_minutes <= 0:

            raise ValueError(
                "duration_minutes must be greater than 0"
            )

        for minutes in range(
            0,
            duration_minutes + 1,
            interval_minutes
        ):

            points.append({

                "latitude": round(
                    current_latitude,
                    6
                ),

                "longitude": round(
                    current_longitude,
                    6
                ),

                "time_minutes": minutes

            })

            # Wind speed is treated as km/h
            # in this prototype.

            distance_km = (
                wind_speed
                *
                (interval_minutes / 60.0)
                *
                self.transport_factor
            )

            (
                current_latitude,
                current_longitude
            ) = self.destination(

                current_latitude,

                current_longitude,

                distance_km,

                wind_direction
            )

        return points


# ============================================================
# STANDALONE TEST
# ============================================================

if __name__ == "__main__":

    model = TrajectoryModel()

    trajectory = model.generate_trajectory(

        latitude=10.98,

        longitude=76.95,

        wind_speed=12,

        wind_direction=315,

        duration_minutes=120,

        interval_minutes=15
    )

    print("\n======================================")
    print("   AIRSHIELD POLLUTION TRAJECTORY")
    print("======================================")

    for point in trajectory:

        print(
            f"{point['time_minutes']:3d} min | "
            f"Lat: {point['latitude']} | "
            f"Lon: {point['longitude']}"
        )

    print("======================================")