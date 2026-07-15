import 'package:file_picker/file_picker.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

Future<void> uploadDocumentFlow(
    BuildContext context, ApiClient api, int vehicleId) async {
  String type = 'RC';
  final titleController = TextEditingController();
  final imagePicker = ImagePicker();
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
                  // TextField(
                  //     controller: titleController,
                  //     decoration: const InputDecoration(labelText: 'Title')),
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
    String? filePath;
    String? fileName;

    final source = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () => Navigator.pop(context, 'camera'),
            ),
            ListTile(
              leading: const Icon(Icons.folder),
              title: const Text('Choose File'),
              onTap: () => Navigator.pop(context, 'file'),
            ),
          ],
        ),
      ),
    );

    if (source == null) return;

    if (source == 'camera') {
      final image = await imagePicker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1600,
      );

      if (image == null) return;

      filePath = image.path;
      fileName = image.name;
    } else {
      final result = await FilePicker.pickFiles(
        withData: false,
      );

      final file = result?.files.single;
      if (file?.path == null) return;

      filePath = file!.path!;
      fileName = file.name;
    }

    await api.uploadDocument(
      vehicleId: vehicleId,
      path: filePath,
      title: titleController.text.trim().isEmpty
          ? fileName
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
