import 'package:flutter/material.dart';

class DocumentViewerScreen extends StatelessWidget {
  final String imageUrl;
  final String title;

  const DocumentViewerScreen({
    super.key,
    required this.imageUrl,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: InteractiveViewer(
        minScale: 1,
        maxScale: 5,
        child: Center(
          child: Image.network(
            imageUrl,
            fit: BoxFit.contain,
            loadingBuilder: (context, child, progress) {
              if (progress == null) return child;

              return const Center(
                child: CircularProgressIndicator(),
              );
            },
            errorBuilder: (_, __, ___) {
              return const Center(
                child: Text("Unable to load image"),
              );
            },
          ),
        ),
      ),
    );
  }
}