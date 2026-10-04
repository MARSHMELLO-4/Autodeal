import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shree_ganesh_autodeal_admin/components/share_document.dart';

class DocumentViewerScreen extends StatelessWidget {
  final String documentUrl;
  final String title;
  final String? contentType;

  const DocumentViewerScreen({
    super.key,
    required this.documentUrl,
    required this.title,
    this.contentType,
  });

  @override
  Widget build(BuildContext context) {
    final canPreviewAsImage = _isImageDocument;

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          IconButton(
            tooltip: 'Share document',
            onPressed: () => shareDocumentFile(
              context,
              documentUrl: documentUrl,
              title: title,
              contentType: contentType,
            ),
            icon: const Icon(Icons.share_rounded),
          ),
          IconButton(
            tooltip: 'Copy link',
            onPressed: () async {
              await Clipboard.setData(ClipboardData(text: documentUrl));
              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Document link copied')),
              );
            },
            icon: const Icon(Icons.link_rounded),
          ),
        ],
      ),
      body: canPreviewAsImage
          ? InteractiveViewer(
              minScale: 1,
              maxScale: 5,
              child: Center(
                child: Image.network(
                  documentUrl,
                  fit: BoxFit.contain,
                  loadingBuilder: (context, child, progress) {
                    if (progress == null) return child;

                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  },
                  errorBuilder: (_, __, ___) {
                    return _DocumentLinkFallback(
                      title: title,
                      documentUrl: documentUrl,
                    );
                  },
                ),
              ),
            )
          : _DocumentLinkFallback(
              title: title,
              documentUrl: documentUrl,
              contentType: contentType,
            ),
    );
  }

  bool get _isImageDocument {
    final normalizedType = contentType?.toLowerCase() ?? '';
    if (normalizedType.startsWith('image/')) {
      return true;
    }

    final normalizedUrl = documentUrl.toLowerCase();
    return normalizedUrl.endsWith('.jpg') ||
        normalizedUrl.endsWith('.jpeg') ||
        normalizedUrl.endsWith('.png') ||
        normalizedUrl.endsWith('.webp') ||
        normalizedUrl.endsWith('.gif');
  }
}

class _DocumentLinkFallback extends StatelessWidget {
  const _DocumentLinkFallback({
    required this.title,
    required this.documentUrl,
    this.contentType,
  });

  final String title;
  final String documentUrl;
  final String? contentType;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.description_outlined, size: 54),
            const SizedBox(height: 14),
            Text(
              title,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            if (contentType != null && contentType!.trim().isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                contentType!,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
            const SizedBox(height: 18),
            SelectableText(
              documentUrl,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 18),
            FilledButton.icon(
              onPressed: () => shareDocumentFile(
                context,
                documentUrl: documentUrl,
                title: title,
                contentType: contentType,
              ),
              icon: const Icon(Icons.share_rounded),
              label: const Text('Share document'),
            ),
          ],
        ),
      ),
    );
  }
}
