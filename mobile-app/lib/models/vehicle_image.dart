class VehicleImage {
  VehicleImage({
    required this.imageUrl,
    this.id,
    this.altText,
    this.displayOrder = 0,
  });

  final int? id;
  final String imageUrl;
  final String? altText;
  final int displayOrder;

  factory VehicleImage.fromJson(Map<String, dynamic> json) {
    return VehicleImage(
      id: json['id'] is num ? (json['id'] as num).toInt() : null,
      imageUrl: json['imageUrl']?.toString() ?? '',
      altText: json['altText']?.toString(),
      displayOrder: json['displayOrder'] is num
          ? (json['displayOrder'] as num).toInt()
          : 0,
    );
  }
}
