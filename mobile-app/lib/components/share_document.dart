import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

Future<void> shareDocumentFile(
  BuildContext context, {
  required String documentUrl,
  required String title,
  String? contentType,
}) async {
  final messenger = ScaffoldMessenger.of(context);

  try {
    final response = await http.get(Uri.parse(documentUrl));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Unable to download document');
    }

    final resolvedContentType = contentType ??
        response.headers['content-type']?.split(';').first.trim();
    final fileName = _buildFileName(
      title: title,
      documentUrl: documentUrl,
      contentType: resolvedContentType,
    );
    final directory = await getTemporaryDirectory();
    final file = File('${directory.path}/$fileName');
    await file.writeAsBytes(response.bodyBytes);

    await Share.shareXFiles(
      [
        XFile(
          file.path,
          mimeType: resolvedContentType,
          name: fileName,
        ),
      ],
      subject: title,
    );
  } catch (e) {
    if (!context.mounted) return;
    messenger.showSnackBar(
      SnackBar(content: Text('Unable to share document: $e')),
    );
  }
}

String _buildFileName({
  required String title,
  required String documentUrl,
  String? contentType,
}) {
  final safeTitle = title
      .trim()
      .replaceAll(RegExp(r'[\\/:*?"<>|]+'), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
  final fallbackTitle = safeTitle.isEmpty ? 'vehicle document' : safeTitle;
  final extension = _extensionFor(documentUrl, contentType);

  if (fallbackTitle.toLowerCase().endsWith(extension)) {
    return fallbackTitle;
  }

  return '$fallbackTitle$extension';
}

String _extensionFor(String documentUrl, String? contentType) {
  final lowerUrl = Uri.tryParse(documentUrl)?.path.toLowerCase() ?? '';
  for (final extension in [
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
  ]) {
    if (lowerUrl.endsWith(extension)) {
      return extension;
    }
  }

  final normalizedType = contentType?.toLowerCase() ?? '';
  if (normalizedType.contains('pdf')) return '.pdf';
  if (normalizedType.contains('jpeg')) return '.jpg';
  if (normalizedType.contains('png')) return '.png';
  if (normalizedType.contains('webp')) return '.webp';
  if (normalizedType.contains('gif')) return '.gif';

  return '.pdf';
}
