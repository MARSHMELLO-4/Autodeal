import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';

import '../vehicle_form_state.dart';
import '../widgets/vehicle_photo_picker.dart';

class VehiclePhotosStep extends StatelessWidget {
  const VehiclePhotosStep({
    required this.form,
    required this.onCamera,
    required this.onGallery,
    required this.onRemoveExisting,
    required this.onRemovePending,
    required this.saving,
    super.key,
  });

  final VehicleFormState form;

  final VoidCallback onCamera;
  final VoidCallback onGallery;

  final ValueChanged<int> onRemoveExisting;
  final ValueChanged<int> onRemovePending;

  final bool saving;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Vehicle Photos',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: 6),

        Text(
          'Add clear photos of the vehicle.',
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
        ),

        const SizedBox(height: 24),

        VehiclePhotoPicker(
          existingPhotos: form.existingPhotos,
          pendingPhotos: form.pendingPhotos,
          onCamera: onCamera,
          onGallery: onGallery,
          onRemoveExisting: onRemoveExisting,
          onRemovePending: onRemovePending,
          saving: saving,
        ),
      ],
    );
  }
}