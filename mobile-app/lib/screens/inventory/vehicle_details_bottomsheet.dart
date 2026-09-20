import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/components/document_viewer_screen.dart';
import 'package:shree_ganesh_autodeal_admin/components/shareVehicle.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/confirm_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/mark_sold_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/upload_document_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_document.dart';
import 'package:shree_ganesh_autodeal_admin/screens/vehicle/vehicle_form_screen.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

Future<void> showVehicleDetails(
    BuildContext context, ApiClient api, int id,
    Future<void> Function() onChanged) async {
  int selectedImage = 0;
  late Future<Vehicle> vehicleFuture;
  vehicleFuture = api.getVehicle(id);

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    backgroundColor: AppColors.white,
    builder: (context) {
      return StatefulBuilder(
        builder: (context, setSheetState) {
          return FutureBuilder<Vehicle>(
            future: vehicleFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return const SizedBox(
                  height: 320,
                  child: Center(child: CircularProgressIndicator(strokeWidth: 3)),
                );
              }
              if (snapshot.hasError) {
                return Padding(
                  padding: const EdgeInsets.all(20),
                  child: ErrorPanel(
                    message: snapshot.error.toString(),
                    onRetry: () => Navigator.pop(context),
                  ),
                );
              }

              final vehicle = snapshot.data!;

              return DraggableScrollableSheet(
                expand: false,
                initialChildSize: 0.9,
                minChildSize: 0.45,
                maxChildSize: 0.96,
                builder: (context, scrollController) {
                  return Column(
                    children: [
                      _buildActionBar(context, vehicle, api, onChanged),
                      Expanded(
                        child: ListView(
                          controller: scrollController,
                          padding: const EdgeInsets.fromLTRB(20, 6, 20, 28),
                          children: [
                            if (vehicle.images.isNotEmpty) ...[
                              _buildGallery(context, vehicle, selectedImage,
                                  setSheetState),
                              const SizedBox(height: 16),
                            ],
                            _buildHeading(context, vehicle),
                            const SizedBox(height: 18),
                            _buildSpecChips(vehicle),
                            if ((vehicle.description ?? '').trim().isNotEmpty) ...[
                              const SizedBox(height: 18),
                              _buildDescription(vehicle),
                            ],
                            const SizedBox(height: 22),
                            _buildDocumentsTitle(context),
                            const SizedBox(height: 10),
                            if (vehicle.documents.isEmpty)
                              const Text(
                                'No documents uploaded yet.',
                                style: TextStyle(color: AppColors.moss, fontSize: 13),
                              ),
                            for (final doc in vehicle.documents)
                              _buildDocumentTile(context, vehicle, doc),
                            const SizedBox(height: 24),
                            _buildActions(context, vehicle, api, onChanged),
                            const SizedBox(height: 8),
                          ],
                        ),
                      ),
                    ],
                  );
                },
              );
            },
          );
        },
      );
    },
  );
}

Widget _buildActionBar(BuildContext context, Vehicle vehicle, ApiClient api,
    Future<void> Function() onChanged) {
  return Container(
    padding: const EdgeInsets.fromLTRB(20, 4, 12, 8),
    decoration: const BoxDecoration(
      color: AppColors.white,
      borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
    ),
    child: Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Vehicle Details',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontSize: 17, letterSpacing: -0.2),
              ),
              const Text(
                'Manage stock, documents & status',
                style: TextStyle(color: AppColors.moss, fontSize: 11.5),
              ),
            ],
          ),
        ),
        _circleAction(
          context,
          tooltip: 'Edit',
          icon: Icons.edit_rounded,
          onTap: () async {
            if (context.mounted) Navigator.pop(context);
            await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => VehicleFormScreen(api: api, existing: vehicle),
              ),
            );
            await onChanged();
          },
        ),
        _circleAction(
          context,
          tooltip: 'Share',
          icon: Icons.share_rounded,
          onTap: () => shareVehicle(vehicle),
        ),
        _circleAction(
          context,
          tooltip: 'Delete',
          icon: Icons.delete_outline_rounded,
          destructive: true,
          onTap: () async {
            final confirmed =
                await confirm(context, 'Delete this bike?');
            if (!confirmed) return;
            await api.deleteVehicle(vehicle.id);
            if (context.mounted) Navigator.pop(context);
            await onChanged();
          },
        ),
      ],
    ),
  );
}

Widget _circleAction(
  BuildContext context, {
  required String tooltip,
  required IconData icon,
  required VoidCallback onTap,
  bool destructive = false,
}) {
  final color = destructive ? AppColors.red : AppColors.maroon700;
  final bg = destructive ? AppColors.redSoft : AppColors.maroon50;
  final border = destructive ? AppColors.maroon100 : AppColors.maroon100;

  return Padding(
    padding: const EdgeInsets.only(left: 4),
    child: Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        child: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(AppTheme.radiusMd - 2),
            border: Border.all(color: border),
          ),
          child: Icon(icon, size: 20, color: color),
        ),
      ),
    ),
  );
}

Widget _buildGallery(BuildContext context, Vehicle vehicle, int selectedImage,
    StateSetter setSheetState) {
  final images = vehicle.images;

  return Column(
    children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        child: Stack(
          children: [
            AspectRatio(
              aspectRatio: 16 / 10,
              child: Image.network(
                images[selectedImage].imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  color: AppColors.maroon50,
                  child: const Icon(
                    Icons.two_wheeler,
                    size: 52,
                    color: AppColors.maroon300,
                  ),
                ),
              ),
            ),
            Positioned(
              right: 10,
              bottom: 10,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.55),
                  borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                ),
                child: Text(
                  '${selectedImage + 1} / ${images.length}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      const SizedBox(height: 10),
      SizedBox(
        height: 76,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: images.length,
          separatorBuilder: (_, __) => const SizedBox(width: 10),
          itemBuilder: (context, index) {
            final active = index == selectedImage;
            return GestureDetector(
              onTap: () => setSheetState(() => selectedImage = index),
              child: AnimatedContainer(
                duration: AppTheme.durationFast,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: active ? AppColors.maroon700 : AppColors.hairedge,
                    width: active ? 2.4 : 1,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.all(2),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    images[index].imageUrl,
                    width: 72,
                    height: 72,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    ],
  );
}

Widget _buildHeading(BuildContext context, Vehicle vehicle) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              vehicle.title,
              style: Theme.of(context)
                  .textTheme
                  .headlineSmall
                  ?.copyWith(fontSize: 21, letterSpacing: -0.4),
            ),
          ),
          const SizedBox(width: 10),
          StatusPill(status: vehicle.status),
        ],
      ),
      const SizedBox(height: 6),
      Row(
        children: [
          Icon(Icons.place_rounded,
              size: 14, color: AppColors.maroon600.withValues(alpha: 0.8)),
          const SizedBox(width: 4),
          Expanded(
            child: Text(
              vehicle.location ?? 'Location not set',
              style: const TextStyle(color: AppColors.moss, fontSize: 12.5),
            ),
          ),
        ],
      ),
      const SizedBox(height: 10),
      Text(
        currencyFormat.format(vehicle.price),
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w900,
          foreground: Paint()
            ..shader = AppColors.brandGradient.createShader(
              const Rect.fromLTWH(0, 0, 220, 44),
            ),
        ),
      ),
    ],
  );
}

Widget _buildSpecChips(Vehicle vehicle) {
  final chips = <Widget>[
    InfoChip(
      icon: Icons.speed_rounded,
      label: '${vehicle.kilometersDriven} km',
    ),
    InfoChip(
      icon: Icons.local_gas_station_rounded,
      label: vehicle.fuelType,
    ),
    InfoChip(
      icon: Icons.calendar_month_rounded,
      label: '${vehicle.manufactureYear}',
    ),
    if (vehicle.ownerSerial != null)
      InfoChip(
        icon: Icons.person_outline_rounded,
        label: '${vehicle.ownerSerial} owner',
      ),
    if (vehicle.color != null)
      InfoChip(icon: Icons.palette_outlined, label: vehicle.color!),
  ];

  return Wrap(spacing: 8, runSpacing: 8, children: chips);
}

Widget _buildDescription(Vehicle vehicle) {
  return Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppColors.paper,
      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      border: Border.all(color: AppColors.hairedge),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'About this bike',
          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14),
        ),
        const SizedBox(height: 6),
        Text(
          vehicle.description!,
          style: const TextStyle(color: AppColors.moss, fontSize: 13),
        ),
      ],
    ),
  );
}

Widget _buildDocumentsTitle(BuildContext context) {
  return Row(
    children: [
      Text(
        'Documents',
        style: Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
      ),
      const SizedBox(width: 8),
      Container(
        width: 7,
        height: 7,
        decoration: const BoxDecoration(
          color: AppColors.maroon400,
          shape: BoxShape.circle,
        ),
      ),
    ],
  );
}

Widget _buildDocumentTile(
    BuildContext context, Vehicle vehicle, VehicleDocument doc) {
  return Container(
    margin: const EdgeInsets.only(bottom: 8),
    decoration: BoxDecoration(
      color: AppColors.white,
      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      border: Border.all(color: AppColors.hairedge),
    ),
    child: ListTile(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppColors.maroon50,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Icon(
          Icons.description_outlined,
          color: AppColors.maroon700,
          size: 20,
        ),
      ),
      title: Text(
        doc.title,
        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
      ),
      subtitle: Text(doc.type, style: const TextStyle(fontSize: 11.5)),
      trailing: const Icon(
        Icons.visibility_outlined,
        color: AppColors.maroon600,
        size: 20,
      ),
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => DocumentViewerScreen(
              imageUrl: doc.fileUrl,
              title: doc.title,
            ),
          ),
        );
      },
    ),
  );
}

Widget _buildActions(BuildContext context, Vehicle vehicle, ApiClient api,
    Future<void> Function() onChanged) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      BrandButton(
        expanded: true,
        icon: Icons.upload_file_rounded,
        label: 'Upload document',
        onPressed: () async {
          await uploadDocumentFlow(context, api, vehicle.id);
        },
      ),
      const SizedBox(height: 10),
      SizedBox(
        height: 50,
        child: OutlinedButton.icon(
          onPressed: vehicle.status == 'SOLD'
              ? null
              : () async {
                  await markSoldFlow(context, api, vehicle);
                  if (context.mounted) Navigator.pop(context);
                  await onChanged();
                },
          icon: const Icon(Icons.payments_outlined, size: 18),
          label: Text(vehicle.status == 'SOLD'
              ? 'Already sold'
              : 'Mark as sold'),
        ),
      ),
    ],
  );
}