import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';

class VehiclePhotoPicker extends StatelessWidget {
  const VehiclePhotoPicker({
    required this.existingPhotos,
    required this.pendingPhotos,
    required this.onCamera,
    required this.onGallery,
    required this.onRemoveExisting,
    required this.onRemovePending,
    required this.saving,
    super.key,
  });

  final List<VehicleImage> existingPhotos;
  final List<XFile> pendingPhotos;

  final VoidCallback onCamera;
  final VoidCallback onGallery;

  final ValueChanged<int> onRemoveExisting;
  final ValueChanged<int> onRemovePending;

  final bool saving;

  @override
  Widget build(BuildContext context) {
    final totalPhotos =
        existingPhotos.length + pendingPhotos.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Expanded(
              child: Text(
                'Vehicle Photos',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Text(
              '$totalPhotos selected',
              style: TextStyle(
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),

        const SizedBox(height: 6),

        Text(
          'Add clear photos of the vehicle. '
              'The first photo will be used as the thumbnail.',
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
        ),

        const SizedBox(height: 20),

        Row(
          children: [
            Expanded(
              child: FilledButton.tonalIcon(
                onPressed: saving ? null : onCamera,
                icon: const Icon(Icons.photo_camera),
                label: const Text('Camera'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: saving ? null : onGallery,
                icon: const Icon(
                  Icons.photo_library_outlined,
                ),
                label: const Text('Gallery'),
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        if (totalPhotos == 0)
          _emptyState(context)
        else
          _photoGrid(),
      ],
    );
  }

  Widget _emptyState(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 180,
      decoration: BoxDecoration(
        border: Border.all(
          color: Colors.grey.shade300,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.add_a_photo_outlined,
            size: 42,
            color: Colors.grey.shade500,
          ),
          const SizedBox(height: 10),
          Text(
            'No photos added yet',
            style: TextStyle(
              color: Colors.grey.shade600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _photoGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount:
      existingPhotos.length + pendingPhotos.length,
      gridDelegate:
      const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 1,
      ),
      itemBuilder: (context, index) {
        if (index < existingPhotos.length) {
          return _photoTile(
            image: Image.network(
              existingPhotos[index].imageUrl,
              fit: BoxFit.cover,
            ),
            isThumbnail: index == 0,
            onRemove: () =>
                onRemoveExisting(index),
          );
        }

        final pendingIndex =
            index - existingPhotos.length;

        return _photoTile(
          image: Image.file(
            File(pendingPhotos[pendingIndex].path),
            fit: BoxFit.cover,
          ),
          isThumbnail:
          existingPhotos.isEmpty && pendingIndex == 0,
          onRemove: () =>
              onRemovePending(pendingIndex),
        );
      },
    );
  }

  Widget _photoTile({
    required Image image,
    required bool isThumbnail,
    required VoidCallback onRemove,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(10),
      child: Stack(
        fit: StackFit.expand,
        children: [
          image,

          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0.15),
                    Colors.transparent,
                    Colors.black.withValues(alpha: 0.35),
                  ],
                ),
              ),
            ),
          ),

          Positioned(
            top: 6,
            right: 6,
            child: IconButton.filledTonal(
              onPressed: saving ? null : onRemove,
              icon: const Icon(
                Icons.close,
                size: 18,
              ),
              tooltip: 'Remove photo',
              style: IconButton.styleFrom(
                minimumSize: const Size(32, 32),
                tapTargetSize:
                MaterialTapTargetSize.shrinkWrap,
              ),
            ),
          ),

          if (isThumbnail)
            Positioned(
              left: 8,
              bottom: 8,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.black87,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'Thumbnail',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}