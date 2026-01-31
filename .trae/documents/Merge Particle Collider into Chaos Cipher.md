# Merge Particle Collider into Chaos Cipher

I have analyzed the `Particle-Collider` folder. It is a high-quality visual simulation using Three.js and MediaPipe for hand tracking. The best way to integrate it is to add it as a new **Hacking Module** within the existing CHAOS CIPHER architecture.

## Implementation Steps:

### 1. Structural Integration
- Create a new `ParticleColliderModule.tsx` component to encapsulate the collider's logic.
- Move `HUD.tsx` and `Visualizer.tsx` to the main [components/](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/components) directory.
- Move `gestureService.ts` and `textSampler.ts` to the main [services/](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/services) directory.

### 2. Configuration Updates
- **Types**: Add `PARTICLE_COLLIDER` to the `ModuleType` enum in [types.ts](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/types.ts).
- **Constants**: Add a new entry to `HACKING_MODULES` in [constants.tsx](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/constants.tsx) so it appears on the dashboard and sidebar.
- **HTML Shell**: Update [index.html](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/index.html) to load the MediaPipe gesture scripts and the "Orbitron" font.

### 3. Dependency Management
- Update [package.json](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/package.json) and the browser `importmap` to include:
  - `three` (for 3D rendering)
  - `lucide-react` (for the collider's unique UI icons)

### 4. Code Unification
- Update the main [App.tsx](file:///c:/Users/ETCHE/Downloads/chaoscipher-_-elite-hacking-mastery/App.tsx) to include a new case in the module switcher that renders the `ParticleColliderModule`.
- Clean up the temporary `Particle-Collider/` directory once the merge is verified.

## Verification
- Run the app in dev mode and ensure the "Particle Collider" appears on the dashboard.
- Verify that the camera/gesture controls work correctly within the new integrated view.

**Do you want me to proceed with this merge?**
