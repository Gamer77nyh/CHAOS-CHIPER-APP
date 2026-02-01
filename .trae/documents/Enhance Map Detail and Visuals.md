# Abuja & Kano Surgical Focus Plan

I will implement a targeted "Surgical View" for Abuja and Kano within the Threat Map.

## Technical Implementation:

### 1. City Detail Layers
- Add a new array of `HighValueTargets` specifically for Abuja and Kano.
- Each target will have a type (e.g., `POWER_GRID`, `DATA_NODE`, `SATELLITE_RELAY`).

### 2. Camera Zoom Controller
- Implement a `zoom` and `center` state for the `ComposableMap`.
- Add a "Fly-to-Target" function that updates the map's coordinates with a smooth transition.

### 3. Tactical HUD Update
- Update [GlobalThreatMap.tsx](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/components/GlobalThreatMap.tsx) to include a "City Selection" sidebar.
- Show live telemetry for the selected city (e.g., "ABJ_GRID_LOAD: 88%", "KANO_UPLINK: ACTIVE").

## Next Steps:
- Add the tactical target data for both cities.
- Update the UI to handle city switching and high-detail zooming.
