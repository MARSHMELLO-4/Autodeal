import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';

class RegionClick {
  RegionClick({
    required this.region,
    required this.country,
    required this.clickCount,
    required this.uniqueVisitors,
  });

  final String region;
  final String country;
  final int clickCount;
  final int uniqueVisitors;

  factory RegionClick.fromJson(Map<String, dynamic> json) {
    return RegionClick(
      region: json['region']?.toString() ?? 'Unknown',
      country: json['country']?.toString() ?? 'Unknown',
      clickCount: toInt(json['clickCount']),
      uniqueVisitors: toInt(json['uniqueVisitors']),
    );
  }
}

class VehicleClickSummary {
  VehicleClickSummary({
    required this.vehicleId,
    required this.vehicleTitle,
    required this.clickCount,
    required this.uniqueVisitors,
    this.lastClickedAt,
  });

  final int vehicleId;
  final String vehicleTitle;
  final int clickCount;
  final int uniqueVisitors;
  final String? lastClickedAt;

  factory VehicleClickSummary.fromJson(Map<String, dynamic> json) {
    return VehicleClickSummary(
      vehicleId: toInt(json['vehicleId']),
      vehicleTitle: json['vehicleTitle']?.toString() ?? '',
      clickCount: toInt(json['clickCount']),
      uniqueVisitors: toInt(json['uniqueVisitors']),
      lastClickedAt: json['lastClickedAt']?.toString(),
    );
  }
}

class VehicleClickReport {
  VehicleClickReport({
    required this.totalClicks,
    required this.uniqueVisitors,
    required this.regions,
    required this.topVehicles,
    this.scopeVehicleId,
    this.generatedAt,
  });

  final int totalClicks;
  final int uniqueVisitors;
  final int? scopeVehicleId;
  final String? generatedAt;
  final List<RegionClick> regions;
  final List<VehicleClickSummary> topVehicles;

  factory VehicleClickReport.fromJson(Map<String, dynamic> json) {
    final scope = json['scopeVehicleId'];
    return VehicleClickReport(
      totalClicks: toInt(json['totalClicks']),
      uniqueVisitors: toInt(json['uniqueVisitors']),
      scopeVehicleId: scope == null ? null : toInt(scope),
      generatedAt: json['generatedAt']?.toString(),
      regions: asJsonList(json['regions'])
          .map((item) => RegionClick.fromJson(asJsonMap(item)))
          .toList(),
      topVehicles: asJsonList(json['topVehicles'])
          .map((item) => VehicleClickSummary.fromJson(asJsonMap(item)))
          .toList(),
    );
  }
}
