# VTubeStudio API Functionalities (via VTubeStudioJS)

Based on the [endpoints.ts](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts) definitions in the `Hawkbat/VTubeStudioJS` repository, here is a categorized list of all functionalities you can control or access in VTubeStudio using the API:

### 1. Model Management
* **Get Available Models**: List all avatars/models available in the user's VTS installation.
* **Get Current Model**: Retrieve details about the currently loaded model (ID, name, position, dimension, Live2D artmesh count, etc.).
* **Load Model**: Tell VTS to switch to a specific model using its ID.
* **Move Model**: Reposition, resize, or rotate the currently loaded model on screen.

### 2. Hotkeys & Expressions
* **List Hotkeys**: Fetch all available hotkeys (and their action types) for the currently loaded model.
* **Trigger Hotkey**: Programmatically trigger a specific hotkey by ID (e.g., to play an animation or toggle a prop).
* **List Expressions**: Get the state and details of all expressions configured for the current model.
* **Activate/Deactivate Expression**: Turn an expression ON or OFF, including setting an optional fade time.

### 3. Parameters & Tracking Data
* **List Parameters**: List all default VTS tracking parameters (Face, Eye, Mouth, etc.) and any custom parameters setup by plugins or the user.
* **Get Parameter Value**: Continuously read or fetch the current value of a specific parameter.
* **Create/Delete Custom Parameters**: Register new inputs (e.g., from an external device or game state) that the VTS model can react to, or delete them when done.
* **Inject Parameter Data**: Continuously send data weights/values to custom parameters, effectively moving the avatar based on external logic (e.g., twitch chat, game controllers, custom face trackers).
* **Check Face Found Status**: Get a boolean flag if VTS currently detects the streamer's face.

### 4. Items / Props System
* **List Items**: See all item files available to be spawned and list all instances currently in the scene.
* **Load Item**: Spawn an item (prop) into the scene at a specific X/Y position, rotation, and size. Also supports loading items from a custom base64 encoded image directly over the API!
* **Unload Item**: Despawn specific items or clear all items loaded by the plugin/user.
* **Move/Sort Item**: Update the position, size, and rotation of existing items. Rearrange their z-index sorting (front to back).
* **Animate Item**: Control the framerate, opacity, brightness, and play state of animated items (like GIFs or animated PNGs).
* **Pin Item**: Pin an item precisely to the model, to another item, or to a specific ArtMesh vertex so it tracks with the avatar's movement.

### 5. ArtMeshes & Visuals
* **List ArtMeshes**: Get a list of all part/layer names and tags of the Live2D model.
* **Select ArtMeshes**: Pop up a UI prompt inside VTS asking the user to manually click and select specific ArtMeshes on their avatar. 
* **Color Tinting**: Dynamically tint individual model parts or the whole avatar using ARGB colors. You can match meshes by name, tag, or number.
* **Model Outline**: Retrieve a mathematical convex hull representing the model's exact silhouette coordinates on-screen.
* **Scene Color Overlay**: Read the average ambient color values of the user's screen or capture parts, which VTS uses to tint the model to match their game lighting.

### 6. Physics Control
* **Get Physics Settings**: Check if the model has physics, the current FPS setting, and get the list of physics groups.
* **Override Physics**: Programmatically take over physics calculations by overriding the "Wind" or "Strength" settings for specific physics groups.

### 7. Post-Processing Effects
* **List Effects**: Get a list of all available post-processing effects and presets (e.g., Bloom, Color Grading, Glitch, VHS).
* **Update Effects**: Turn post-processing on/off, load presets, or dynamically tweak individual slider values for specific effects via the API.

### 8. System & Configuration State
* **API Details & Auth**: Authenticate your application, get VTS statistics (uptime, FPS), and check folder paths.
* **NDI Configuration**: Toggle NDI (Network Device Interface) output settings and resolution over the network.
* **Permissions**: Prompt the user to grant specific permissions (if an action requires elevated access).

### 9. Event Subscriptions
Instead of polling, you can subscribe to real-time events that will be pushed to your plugin:
* [ModelLoaded](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#587-594), [ModelMoved](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#617-629), [ModelConfigChanged](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#609-616), [ModelOutline](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#630-639)
* [TrackingStatusChanged](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#595-602) (Face lost/found, hands lost/found)
* [BackgroundChanged](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#603-608)
* [HotkeyTriggered](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#640-653)
* [ModelAnimation](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#654-668) (When an animation starts/ends)
* [ModelClicked](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#682-716) (Detects if the user clicks directly on the avatar, calculating exactly which ArtMesh was hit!)
* [Item](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#669-681) (Spawn, Drop, Click, Lock, Unlock events for props)
* [PostProcessing](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#717-723) (When effects change)
* [Live2DCubismEditorConnected](file:///d:/Projects/vts-shortcut/VTubeStudioJS_repo/src/endpoints.ts#724-731)
