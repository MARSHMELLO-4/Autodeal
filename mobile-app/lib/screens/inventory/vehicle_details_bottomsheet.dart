import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/components/document_viewer_screen.dart';
import 'package:shree_ganesh_autodeal_admin/components/shareVehicle.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/confirm_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/mark_sold_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/upload_document_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/screens/vehicle/vehicle_form_screen.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

Future<void> showVehicleDetails(BuildContext context, ApiClient api, int id,
    Future<void> Function() onChanged) async {

  int selectedImage = 0;
  late Future<Vehicle> vehicleFuture;
  vehicleFuture = api.getVehicle(id);

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (context) {
      return StatefulBuilder(
        builder: (context, setState){
          return FutureBuilder<Vehicle>(
            future: vehicleFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState != ConnectionState.done) {
                return const SizedBox(
                    height: 280, child: Center(child: CircularProgressIndicator()));
              }
              if (snapshot.hasError) {
                return Padding(
                  padding: const EdgeInsets.all(16),
                  child: ErrorPanel(
                      message: snapshot.error.toString(),
                      onRetry: () => Navigator.pop(context)),
                );
              }
              final vehicle = snapshot.data!;
              return DraggableScrollableSheet(
                expand: false,
                initialChildSize: 0.86,
                minChildSize: 0.45,
                maxChildSize: 0.95,
                builder: (context, controller) {
                  return ListView(
                    controller: controller,
                    padding: const EdgeInsets.all(16),
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [

                          IconButton(
                            tooltip: "Edit",
                            icon: const Icon(Icons.edit_outlined),
                            onPressed: () async {
                              if (context.mounted) Navigator.pop(context);

                              await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => VehicleFormScreen(
                                    api: api,
                                    existing: vehicle,
                                  ),
                                ),
                              );

                              await onChanged();
                            },
                          ),

                          IconButton(
                            tooltip: "Share",
                            icon: const Icon(Icons.share_outlined),
                            onPressed: () {
                              shareVehicle(vehicle);
                            },
                          ),

                          IconButton(
                            tooltip: "Delete",
                            color: Colors.red,
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () async {
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
                      if (vehicle.images.isNotEmpty) ...[
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            vehicle.images[selectedImage].imageUrl,
                            height: 240,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),

                        const SizedBox(height: 12),

                        SizedBox(
                          height: 90,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: vehicle.images.length,
                            itemBuilder: (context, index) {
                              final image = vehicle.images[index];

                              return GestureDetector(
                                onTap: () {
                                  setState(() {
                                    selectedImage = index;
                                  });
                                },
                                child: Container(
                                  margin: const EdgeInsets.only(right: 10),
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: selectedImage == index
                                          ? Theme.of(context).colorScheme.primary
                                          : Colors.grey.shade300,
                                      width: 2,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(6),
                                    child: Image.network(
                                      image.imageUrl,
                                      width: 90,
                                      height: 90,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                              child: Text(vehicle.title,
                                  style:
                                  Theme.of(context).textTheme.headlineSmall)),
                          StatusPill(status: vehicle.status),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(currencyFormat.format(vehicle.price),
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context).colorScheme.secondary,
                              fontWeight: FontWeight.bold)),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          InfoChip(
                              icon: Icons.speed,
                              label: '${vehicle.kilometersDriven} km'),
                          InfoChip(
                              icon: Icons.local_gas_station,
                              label: vehicle.fuelType),
                          InfoChip(
                              icon: Icons.calendar_month,
                              label: '${vehicle.manufactureYear}'),
                          if (vehicle.color != null)
                            InfoChip(icon: Icons.palette, label: vehicle.color!),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(vehicle.description ?? 'No description added.'),
                      const SizedBox(height: 20),
                      Text('Documents',
                          style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      if (vehicle.documents.isEmpty)
                        const Text('No documents uploaded yet.'),
                      for (final doc in vehicle.documents)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.description_outlined),
                          title: Text(doc.title),
                          subtitle: Text(doc.type),
                          trailing: const Icon(Icons.visibility_outlined),
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
                      const SizedBox(height: 16),
                      FilledButton.icon(
                        onPressed: () async {
                          await uploadDocumentFlow(context, api, vehicle.id);
                          setState(() {
                            vehicleFuture = api.getVehicle(id);
                          });
                          // if (context.mounted) Navigator.pop(context);
                          // await onChanged();
                        },
                        icon: const Icon(Icons.upload_file),
                        label: const Text('Upload document'),
                      ),
                      const SizedBox(height: 8),
                      FilledButton.tonalIcon(
                        onPressed: vehicle.status == 'SOLD'
                            ? null
                            : () async {
                          await markSoldFlow(context, api, vehicle);
                          if (context.mounted) Navigator.pop(context);
                          await onChanged();
                        },
                        icon: const Icon(Icons.payments_outlined),
                        label: const Text('Mark as sold'),
                      ),
                      const SizedBox(height: 8),
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
