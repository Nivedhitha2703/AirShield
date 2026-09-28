# AirShield — Member 1: Data & Pollution Detection

## Role

**Environmental Intelligence Engineer**

Member 1 is responsible for answering:

> **"Is pollution happening, and what evidence do we have?"**

The module forms the environmental intelligence layer of AirShield by collecting environmental data, simulating sensor networks, detecting abnormal pollution patterns, analysing citizen-submitted images, and combining multiple evidence sources into pollution events.

---

## Responsibilities

### 1. Environmental Data Collection

The module handles environmental parameters such as:

- PM2.5
- PM10
- NO₂
- SO₂
- CO
- AQI
- Temperature
- Humidity
- Wind conditions
- Satellite-related evidence

For the prototype, simulated datasets are used where live environmental APIs are not required.

---

### 2. Virtual Sensor Simulation

AirShield simulates multiple environmental monitoring nodes.

Example:

| Sensor | PM2.5 | Status |
|---|---:|---|
| Sensor A | 45 | Normal |
| Sensor B | 51 | Normal |
| Sensor C | 132 | Anomaly |
| Sensor D | 48 | Normal |

This allows the system to demonstrate how a localized pollution hotspot can be detected even when surrounding sensors report normal conditions.

---

### 3. Pollution Anomaly Detection

The module applies machine-learning based anomaly detection to environmental sensor readings.

Current prototype approach:

**Isolation Forest**

Input features include:

- PM2.5
- PM10
- NO₂
- Temperature
- Humidity
- Historical AQI

Output:

```text
Normal