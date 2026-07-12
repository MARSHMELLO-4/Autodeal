import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/dialogs/confirm_dialog.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/screens/vehicle/vehicle_form_screen.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

Future<void> showVehicleDetails(BuildContext context, ApiClient api, int id,
    Future<void> Function() onChanged) async {

  int selectedImage = 0;

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (context) {
      return StatefulBuilder(
        builder: (context, setState){
          return FutureBuilder<Vehicle>(
            future: api.getVehicle(id),
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
                        ),
                      const SizedBox(height: 16),
                      FilledButton.icon(
                        onPressed: () async {
                          await uploadDocumentFlow(context, api, vehicle.id);
                          if (context.mounted) Navigator.pop(context);
                          await onChanged();
                        },
                        icon: const Icon(Icons.upload_file),
                        label: const Text('Upload document'),
                      ),
                      const SizedBox(height: 8),
                      FilledButton.tonalIcon(
                        onPressed: () async {
                          if (context.mounted) Navigator.pop(context);
                          await Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (_) =>
                                    VehicleFormScreen(api: api, existing: vehicle)),
                          );
                          await onChanged();
                        },
                        icon: const Icon(Icons.edit),
                        label: const Text('Edit bike'),
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
                      OutlinedButton.icon(
                        onPressed: () async {
                          final confirmed =
                          await confirm(context, 'Delete this bike?');
                          if (!confirmed) return;
                          await api.deleteVehicle(vehicle.id);
                          if (context.mounted) Navigator.pop(context);
                          await onChanged();
                        },
                        icon: const Icon(Icons.delete_outline),
                        label: const Text('Delete bike'),
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

Future<void> uploadDocumentFlow(
    BuildContext context, ApiClient api, int vehicleId) async {
  String type = 'RC';
  final titleController = TextEditingController();
  try {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Upload document'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DropdownButtonFormField<String>(
                    initialValue: type,
                    items: [
                      'RC',
                      'INSURANCE',
                      'PUC',
                      'NOC',
                      'FORM_29',
                      'FORM_30',
                      'SALE_INVOICE',
                      'OTHER'
                    ]
                        .map((item) =>
                            DropdownMenuItem(value: item, child: Text(item)))
                        .toList(),
                    onChanged: (value) =>
                        setState(() => type = value ?? 'OTHER'),
                    decoration: const InputDecoration(labelText: 'Type'),
                  ),
                  TextField(
                      controller: titleController,
                      decoration: const InputDecoration(labelText: 'Title')),
                ],
              ),
              actions: [
                TextButton(
                    onPressed: () => Navigator.pop(context, false),
                    child: const Text('Cancel')),
                FilledButton(
                    onPressed: () => Navigator.pop(context, true),
                    child: const Text('Pick file')),
              ],
            );
          },
        );
      },
    );
    if (confirmed != true) return;
    final result = await FilePicker.pickFiles(withData: false);
    final file = result?.files.single;
    if (file?.path == null) return;
    await api.uploadDocument(
      vehicleId: vehicleId,
      path: file!.path!,
      title: titleController.text.trim().isEmpty
          ? file.name
          : titleController.text.trim(),
      type: type,
    );
    if (context.mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Document uploaded')));
    }
  } finally {
    titleController.dispose();
  }
}

Future<void> markSoldFlow(
    BuildContext context, ApiClient api, Vehicle vehicle) async {
  final priceController =
      TextEditingController(text: vehicle.price.toStringAsFixed(0));
  final buyerNameController = TextEditingController();
  final buyerPhoneController = TextEditingController();
  final notesController = TextEditingController();
  try {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Mark as sold'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                    controller: priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Sale price')),
                TextField(
                    controller: buyerNameController,
                    decoration: const InputDecoration(labelText: 'Buyer name')),
                TextField(
                    controller: buyerPhoneController,
                    keyboardType: TextInputType.phone,
                    decoration:
                        const InputDecoration(labelText: 'Buyer phone')),
                TextField(
                    controller: notesController,
                    decoration: const InputDecoration(labelText: 'Notes')),
              ],
            ),
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel')),
            FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Save sale')),
          ],
        );
      },
    );
    if (confirmed != true) return;
    await api.markSold(
      vehicleId: vehicle.id,
      salePrice: double.parse(priceController.text),
      buyerName: buyerNameController.text.trim(),
      buyerPhone: buyerPhoneController.text.trim(),
      notes: notesController.text.trim(),
    );
    if (context.mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Sale saved')));
    }
  } finally {
    priceController.dispose();
    buyerNameController.dispose();
    buyerPhoneController.dispose();
    notesController.dispose();
  }
}
