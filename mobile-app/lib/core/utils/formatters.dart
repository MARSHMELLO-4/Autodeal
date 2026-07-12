import 'package:intl/intl.dart';

final currencyFormat = NumberFormat.currency(
  locale: 'en_IN',
  symbol: 'Rs. ',
  decimalDigits: 0,
);

int toInt(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  return int.tryParse(value?.toString() ?? '') ?? 0;
}

double toDouble(dynamic value) {
  if (value is double) return value;
  if (value is num) return value.toDouble();
  return double.tryParse(value?.toString() ?? '') ?? 0;
}

int? nullableInt(String value) {
  if (value.trim().isEmpty) return null;
  return int.parse(value);
}

String? emptyToNull(String value) {
  return value.trim().isEmpty ? null : value.trim();
}

Map<String, dynamic> asJsonMap(dynamic value) {
  if (value is Map<String, dynamic>) return value;
  if (value is Map) return Map<String, dynamic>.from(value);
  return <String, dynamic>{};
}

List<dynamic> asJsonList(dynamic value) {
  return value is List ? value : const <dynamic>[];
}
