import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shree_ganesh_autodeal_admin/models/ai_share_result.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

Future<void> shareAiGeneratedImage(
  BuildContext context,
  ApiClient api,
  Vehicle vehicle,
) async {
  final messenger = ScaffoldMessenger.of(context);

  showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (_) => const AiGeneratingDialog(),
  );

  AiShareResult? result;
  String? error;

  try {
    result = await api.generateAiShare(vehicle.id);
  } catch (e) {
    error = e.toString();
  }

  if (!context.mounted) return;

  Navigator.of(context, rootNavigator: true).pop();

  if (result == null) {
    messenger.showSnackBar(
      SnackBar(
        content: Text(error ?? 'Something went wrong. Please try again.'),
      ),
    );
    return;
  }

  final File file;
  try {
    file = await saveImageToTemp(result);
  } catch (e) {
    messenger.showSnackBar(
      SnackBar(content: Text('Unable to save the generated image: $e')),
    );
    return;
  }

  if (!context.mounted) return;

  final AiShareResult shareResult = result;

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (_) => AiSharePreviewSheet(
      file: file,
      title: shareResult.title,
    ),
  );
}

Future<File> saveImageToTemp(AiShareResult result) async {
  final bytes = base64Decode(result.imageBase64);
  final dir = await getTemporaryDirectory();
  final file = File(
    '${dir.path}/ai_share_${result.vehicleId}_${DateTime.now().millisecondsSinceEpoch}.png',
  );
  await file.writeAsBytes(bytes);
  return file;
}

class AiGeneratingDialog extends StatelessWidget {
  const AiGeneratingDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.auto_awesome,
              size: 48,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 16),
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            const Text(
              'AI is creating your promo image...',
              textAlign: TextAlign.center,
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            const Text(
              'This takes about 10-20 seconds.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class AiSharePreviewSheet extends StatelessWidget {
  const AiSharePreviewSheet({
    required this.file,
    required this.title,
    super.key,
  });

  final File file;
  final String title;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'AI Share ready!',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxHeight: 420),
                child: Image.file(
                  file,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () async {
                try {
                  await Share.shareXFiles(
                    [XFile(file.path)],
                    text: '🏍 $title — Shree Ganesh Autodeal',
                  );
                } catch (e) {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Unable to share: $e')),
                    );
                  }
                }
              },
              icon: const Icon(Icons.share),
              label: const Text('Share on WhatsApp'),
            ),
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }
}