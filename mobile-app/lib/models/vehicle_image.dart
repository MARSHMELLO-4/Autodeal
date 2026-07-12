class VehicleImage {
  VehicleImage({required this.imageUrl, this.altText});

  final String imageUrl;
  final String? altText;

  factory VehicleImage.fromJson(Map<String, dynamic> json) {
    return VehicleImage(
      imageUrl: json['imageUrl']?.toString() ?? '',
      altText: json['altText']?.toString(),
    );
  }
}