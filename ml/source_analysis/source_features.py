import math


class SourceFeatureExtractor:
    """
    Extracts environmental and temporal indicators
    used by the AirShield pollution source classifier.
    """

    def __init__(self):
        pass

    def convert_wind_direction(self, wind_direction):
        """
        Convert wind direction into degrees.

        Accepts either:
            numeric degrees
            "N"
            "NE"
            "E"
            "SE"
            "S"
            "SW"
            "W"
            "NW"
            "cv"

        Meteorological convention:
            0   = North
            90  = East
            180 = South
            270 = West
        """

        if isinstance(wind_direction, (int, float)):
            return float(wind_direction)

        direction = str(
            wind_direction
        ).strip().upper()

        direction_map = {
            "N": 0.0,
            "NE": 45.0,
            "E": 90.0,
            "SE": 135.0,
            "S": 180.0,
            "SW": 225.0,
            "W": 270.0,
            "NW": 315.0,
            "CV": 0.0
        }

        if direction in direction_map:
            return direction_map[direction]

        try:
            return float(direction)

        except ValueError:
            raise ValueError(
                f"Unsupported wind direction: "
                f"{wind_direction}"
            )

    def wind_components(
        self,
        wind_speed,
        wind_direction
    ):
        """
        Convert wind speed and direction
        into approximate vector components.
        """

        speed = max(
            0.0,
            float(wind_speed)
        )

        direction = self.convert_wind_direction(
            wind_direction
        )

        radians = math.radians(
            direction
        )

        u = (
            speed
            * math.sin(radians)
        )

        v = (
            speed
            * math.cos(radians)
        )

        return {
            "wind_u": u,
            "wind_v": v
        }

    def pm25_intensity(self, pm25):
        """
        Normalize PM2.5 concentration
        into a 0-1 intensity score.
        """

        pm25 = max(
            0.0,
            float(pm25)
        )

        return min(
            pm25 / 300.0,
            1.0
        )

    def temperature_signal(self, temperature):
        """
        Convert temperature into a
        normalized prototype signal.
        """

        temperature = float(
            temperature
        )

        score = (
            temperature + 10.0
        ) / 50.0

        return max(
            0.0,
            min(score, 1.0)
        )

    def humidity_signal(
        self,
        dewp,
        temperature
    ):
        """
        Estimate a moisture-related signal
        using temperature and dew point.
        """

        temperature = float(
            temperature
        )

        dewp = float(
            dewp
        )

        difference = (
            temperature - dewp
        )

        if difference <= 0:
            return 1.0

        score = (
            1.0
            - min(
                difference / 40.0,
                1.0
            )
        )

        return max(
            0.0,
            min(score, 1.0)
        )

    def time_features(self, hour):
        """
        Extract simple time-of-day signals.
        """

        hour = int(hour)

        if 7 <= hour <= 10:

            period = "MORNING"

        elif 17 <= hour <= 21:

            period = "EVENING"

        elif 11 <= hour <= 16:

            period = "DAYTIME"

        else:

            period = "NIGHT"

        traffic_score = (
            1.0
            if period in {
                "MORNING",
                "EVENING"
            }
            else 0.4
        )

        biomass_score = (
            0.8
            if period in {
                "MORNING",
                "EVENING"
            }
            else 0.3
        )

        return {
            "period": period,
            "traffic_score": traffic_score,
            "biomass_score": biomass_score
        }

    def extract(self, event):
        """
        Extract all source-analysis features
        from an AirShield event.
        """

        pm25 = float(
            event.get(
                "pm25",
                0
            )
        )

        temperature = float(
            event.get(
                "TEMP",
                25
            )
        )

        dewp = float(
            event.get(
                "DEWP",
                15
            )
        )

        wind_speed = float(
            event.get(
                "Iws",
                event.get(
                    "wind_speed",
                    5
                )
            )
        )

        wind_direction = event.get(
            "wind_direction",
            event.get(
                "wind_direction_degrees",
                0
            )
        )

        hour = int(
            event.get(
                "hour",
                12
            )
        )

        wind = self.wind_components(
            wind_speed,
            wind_direction
        )

        time = self.time_features(
            hour
        )

        return {

            "pm25_intensity":
                self.pm25_intensity(
                    pm25
                ),

            "temperature_signal":
                self.temperature_signal(
                    temperature
                ),

            "moisture_signal":
                self.humidity_signal(
                    dewp,
                    temperature
                ),

            "wind_speed":
                wind_speed,

            "wind_u":
                wind["wind_u"],

            "wind_v":
                wind["wind_v"],

            "traffic_score":
                time["traffic_score"],

            "biomass_score":
                time["biomass_score"],

            "time_period":
                time["period"]
        }