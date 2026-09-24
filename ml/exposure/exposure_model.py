import math


class ExposureModel:
    """
    AirShield Exposure Intelligence.

    Estimates potential exposure around a predicted
    pollution plume.

    IMPORTANT:
    This is a prototype.

    It uses supplied population density and
    vulnerable-location data.

    It does NOT query a live population database
    or official GIS infrastructure.
    """

    def __init__(self):

        self.risk_radius_multiplier = {

            "GOOD": 0.5,

            "MODERATE": 0.75,

            "UNHEALTHY_FOR_SENSITIVE_GROUPS": 1.0,

            "UNHEALTHY": 1.25,

            "VERY_UNHEALTHY": 1.5,

            "HAZARDOUS": 2.0
        }

    def distance_km(
        self,
        lat1,
        lon1,
        lat2,
        lon2
    ):
        """
        Calculate approximate great-circle
        distance between two coordinates.
        """

        earth_radius = 6371.0

        lat1 = math.radians(lat1)
        lon1 = math.radians(lon1)

        lat2 = math.radians(lat2)
        lon2 = math.radians(lon2)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = (
            math.sin(dlat / 2) ** 2
            +
            math.cos(lat1)
            * math.cos(lat2)
            * math.sin(dlon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        return earth_radius * c

    def calculate_location_exposure(
        self,
        plume,
        locations,
        location_type
    ):
        """
        Determine which vulnerable locations
        intersect the predicted plume.
        """

        affected = []

        for location in locations:

            minimum_distance = float("inf")

            closest_time = None

            for plume_point in plume:

                distance = self.distance_km(

                    location["latitude"],
                    location["longitude"],

                    plume_point["latitude"],
                    plume_point["longitude"]
                )

                plume_radius = (
                    plume_point["estimated_width_km"]
                    / 2
                )

                if distance <= plume_radius:

                    if distance < minimum_distance:

                        minimum_distance = distance

                        closest_time = (
                            plume_point[
                                "time_minutes"
                            ]
                        )

            if closest_time is not None:

                affected.append({

                    "id": location["id"],

                    "name": location["name"],

                    "type": location_type,

                    "distance_km":
                        round(
                            minimum_distance,
                            3
                        ),

                    "predicted_arrival_minutes":
                        closest_time
                })

        return affected

    def estimate_population_exposure(
        self,
        population,
        plume,
        risk_level
    ):
        """
        Estimate potentially exposed population.

        Uses:

            affected area × population density ×
            risk multiplier
        """

        if not plume:
            return 0

        final_width = (
            plume[-1]["estimated_width_km"]
        )

        radius = final_width / 2

        multiplier = (
            self.risk_radius_multiplier.get(
                risk_level,
                1.0
            )
        )

        affected_area = (
            math.pi
            * radius
            * radius
            * multiplier
        )

        density = float(
            population.get(
                "density_per_km2",
                0
            )
        )

        estimate = (
            affected_area
            * density
        )

        return max(
            0,
            int(round(estimate))
        )

    def analyze(
        self,
        plume,
        risk_level,
        population,
        schools=None,
        hospitals=None
    ):
        """
        Complete exposure analysis.
        """

        schools = schools or []

        hospitals = hospitals or []

        affected_schools = (
            self.calculate_location_exposure(
                plume,
                schools,
                "SCHOOL"
            )
        )

        affected_hospitals = (
            self.calculate_location_exposure(
                plume,
                hospitals,
                "HOSPITAL"
            )
        )

        exposed_population = (
            self.estimate_population_exposure(
                population,
                plume,
                risk_level
            )
        )

        # Exposure severity

        if risk_level in {
            "VERY_UNHEALTHY",
            "HAZARDOUS"
        }:

            exposure_level = "HIGH"

        elif risk_level in {
            "UNHEALTHY",
            "UNHEALTHY_FOR_SENSITIVE_GROUPS"
        }:

            exposure_level = "MODERATE"

        else:

            exposure_level = "LOW"

        return {

            "exposure_level":
                exposure_level,

            "estimated_exposed_population":
                exposed_population,

            "affected_schools":
                affected_schools,

            "affected_hospitals":
                affected_hospitals,

            "school_count":
                len(affected_schools),

            "hospital_count":
                len(affected_hospitals)
        }