import 'dart:convert';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

const apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://192.168.29.193:9090',
);

final currencyFormat = NumberFormat.currency(
  locale: 'en_IN',
  symbol: 'Rs. ',
  decimalDigits: 0,
);

void main() {
  runApp(const AutodealAdminApp());
}

class AutodealAdminApp extends StatelessWidget {
  const AutodealAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xff1f6f54),
      primary: const Color(0xff1f6f54),
      secondary: const Color(0xffd2462f),
      surface: const Color(0xfff6f7f5),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Shree Ganesh Autodeal Admin',
      theme: ThemeData(
        colorScheme: colorScheme,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xfff6f7f5),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          color: Colors.white,
        ),
      ),
      home: const AdminHome(),
    );
  }
}

class AdminHome extends StatefulWidget {
  const AdminHome({super.key});

  @override
  State<AdminHome> createState() => _AdminHomeState();
}

class _AdminHomeState extends State<AdminHome> {
  int index = 0;
  final api = ApiClient(apiBaseUrl);

  @override
  Widget build(BuildContext context) {
    final pages = [
      InventoryPage(api: api),
      VehicleFormScreen(api: api),
      ReportsPage(api: api),
    ];
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shree Ganesh Autodeal'),
        centerTitle: false,
      ),
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.two_wheeler_outlined), selectedIcon: Icon(Icons.two_wheeler), label: 'Stock'),
          NavigationDestination(icon: Icon(Icons.add_circle_outline), selectedIcon: Icon(Icons.add_circle), label: 'Add'),
          NavigationDestination(icon: Icon(Icons.bar_chart_outlined), selectedIcon: Icon(Icons.bar_chart), label: 'Reports'),
        ],
      ),
    );
  }
}

class ApiClient {
  ApiClient(this.baseUrl);

  final String baseUrl;

  Future<List<Category>> getCategories() async {
    final json = await _get('/api/admin/categories');
    return (json as List).map((item) => Category.fromJson(item)).toList();
  }

  Future<Category> createCategory(String name) async {
    final json = await _send(
      'POST',
      '/api/admin/categories',
      {'name': name},
    );
    return Category.fromJson(json);
  }

  Future<List<Vehicle>> getVehicles({String? search, String? status}) async {
    final params = <String, String>{'page': '0', 'size': '100'};
    if (search != null && search.trim().isNotEmpty) params['search'] = search.trim();
    if (status != null && status != 'ALL') params['status'] = status;
    final json = await _get('/api/admin/vehicles?${Uri(queryParameters: params).query}');
    final content = json is Map<String, dynamic> ? json['content'] as List : json as List;
    return content.map((item) => Vehicle.fromJson(item)).toList();
  }

  Future<Vehicle> getVehicle(int id) async {
    final json = await _get('/api/admin/vehicles/$id');
    return Vehicle.fromJson(json);
  }

  Future<Vehicle> saveVehicle(VehicleDraft draft, {int? id}) async {
    final json = await _send(
      id == null ? 'POST' : 'PUT',
      id == null ? '/api/admin/vehicles' : '/api/admin/vehicles/$id',
      draft.toJson(),
    );
    return Vehicle.fromJson(json);
  }

  Future<void> deleteVehicle(int id) async {
    await _delete('/api/admin/vehicles/$id');
  }

  Future<void> uploadDocument({
    required int vehicleId,
    required String path,
    required String title,
    required String type,
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/admin/vehicles/$vehicleId/documents'),
    );
    request.fields['title'] = title;
    request.fields['type'] = type;
    request.files.add(await http.MultipartFile.fromPath('file', path));
    final response = await request.send();
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final body = await response.stream.bytesToString();
      throw Exception(_messageFromBody(body, 'Unable to upload document'));
    }
  }

  Future<void> markSold({
    required int vehicleId,
    required double salePrice,
    required String buyerName,
    required String buyerPhone,
    required String notes,
  }) async {
    await _send('POST', '/api/admin/vehicles/$vehicleId/sales', {
      'salePrice': salePrice,
      'buyerName': buyerName,
      'buyerPhone': buyerPhone,
      'notes': notes,
      'saleDate': DateFormat('yyyy-MM-dd').format(DateTime.now()),
    });
  }

  Future<SalesReport> getSalesReport() async {
    final json = await _get('/api/admin/sales/report');
    return SalesReport.fromJson(json);
  }

  Future<dynamic> _get(String path) async {
    final response = await http.get(Uri.parse('$baseUrl$path'));
    return _decode(response);
  }

  Future<dynamic> _send(String method, String path, Map<String, dynamic> body) async {
    final uri = Uri.parse('$baseUrl$path');
    final response = method == 'POST'
        ? await http.post(uri, headers: _headers, body: jsonEncode(body))
        : await http.put(uri, headers: _headers, body: jsonEncode(body));
    return _decode(response);
  }

  Future<void> _delete(String path) async {
    final response = await http.delete(Uri.parse('$baseUrl$path'));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_messageFromBody(response.body, 'Request failed'));
    }
  }

  dynamic _decode(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_messageFromBody(response.body, 'Request failed'));
    }
    if (response.body.isEmpty) return null;
    return jsonDecode(response.body);
  }

  String _messageFromBody(String body, String fallback) {
    try {
      final json = jsonDecode(body);
      return json['message']?.toString() ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  Map<String, String> get _headers => {'Content-Type': 'application/json'};
}

class Category {
  Category({required this.id, required this.name, required this.slug});

  final int id;
  final String name;
  final String slug;

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as int,
      name: json['name']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
    );
  }
}

class Vehicle {
  Vehicle({
    required this.id,
    required this.title,
    required this.brand,
    required this.modelName,
    required this.manufactureYear,
    required this.kilometersDriven,
    required this.fuelType,
    required this.price,
    required this.status,
    this.registrationNumber,
    this.variantName,
    this.registrationYear,
    this.ownerSerial,
    this.color,
    this.description,
    this.category,
    this.thumbnailUrl,
    this.location,
    this.images = const [],
    this.documents = const [],
  });

  final int id;
  final String title;
  final String brand;
  final String modelName;
  final int manufactureYear;
  final int kilometersDriven;
  final String fuelType;
  final double price;
  final String status;
  final String? registrationNumber;
  final String? variantName;
  final int? registrationYear;
  final int? ownerSerial;
  final String? color;
  final String? description;
  final Category? category;
  final String? thumbnailUrl;
  final String? location;
  final List<VehicleImage> images;
  final List<VehicleDocument> documents;

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'] as int,
      title: json['title']?.toString() ?? '',
      brand: json['brand']?.toString() ?? '',
      modelName: json['modelName']?.toString() ?? '',
      manufactureYear: _toInt(json['manufactureYear']),
      kilometersDriven: _toInt(json['kilometersDriven']),
      fuelType: json['fuelType']?.toString() ?? 'PETROL',
      price: _toDouble(json['price']),
      status: json['status']?.toString() ?? 'AVAILABLE',
      registrationNumber: json['registrationNumber']?.toString(),
      variantName: json['variantName']?.toString(),
      registrationYear: json['registrationYear'] == null ? null : _toInt(json['registrationYear']),
      ownerSerial: json['ownerSerial'] == null ? null : _toInt(json['ownerSerial']),
      color: json['color']?.toString(),
      description: json['description']?.toString(),
      category: json['category'] == null ? null : Category.fromJson(json['category']),
      thumbnailUrl: json['thumbnailUrl']?.toString(),
      location: json['location']?.toString(),
      images: ((json['images'] ?? []) as List).map((item) => VehicleImage.fromJson(item)).toList(),
      documents: ((json['documents'] ?? []) as List).map((item) => VehicleDocument.fromJson(item)).toList(),
    );
  }
}

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

class VehicleDocument {
  VehicleDocument({required this.id, required this.title, required this.type, required this.fileUrl});

  final int id;
  final String title;
  final String type;
  final String fileUrl;

  factory VehicleDocument.fromJson(Map<String, dynamic> json) {
    return VehicleDocument(
      id: json['id'] as int,
      title: json['title']?.toString() ?? '',
      type: json['type']?.toString() ?? 'OTHER',
      fileUrl: json['fileUrl']?.toString() ?? '',
    );
  }
}

class VehicleDraft {
  VehicleDraft({
    required this.title,
    required this.registrationNumber,
    required this.brand,
    required this.modelName,
    required this.variantName,
    required this.manufactureYear,
    required this.registrationYear,
    required this.kilometersDriven,
    required this.fuelType,
    required this.ownerSerial,
    required this.color,
    required this.price,
    required this.description,
    required this.status,
    required this.categoryId,
    required this.thumbnailUrl,
    required this.location,
    required this.imageUrl,
  });

  final String title;
  final String registrationNumber;
  final String brand;
  final String modelName;
  final String variantName;
  final int manufactureYear;
  final int? registrationYear;
  final int kilometersDriven;
  final String fuelType;
  final int? ownerSerial;
  final String color;
  final double price;
  final String description;
  final String status;
  final int categoryId;
  final String thumbnailUrl;
  final String location;
  final String imageUrl;

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'registrationNumber': _emptyToNull(registrationNumber),
      'brand': brand,
      'modelName': modelName,
      'variantName': _emptyToNull(variantName),
      'manufactureYear': manufactureYear,
      'registrationYear': registrationYear,
      'kilometersDriven': kilometersDriven,
      'fuelType': fuelType,
      'ownerSerial': ownerSerial,
      'color': _emptyToNull(color),
      'price': price,
      'description': _emptyToNull(description),
      'status': status,
      'categoryId': categoryId,
      'thumbnailUrl': _emptyToNull(thumbnailUrl),
      'location': _emptyToNull(location),
      'images': imageUrl.trim().isEmpty
          ? []
          : [
              {'imageUrl': imageUrl.trim(), 'altText': title, 'displayOrder': 0}
            ],
    };
  }
}

class SalesReport {
  SalesReport({
    required this.totalRevenue,
    required this.totalVehiclesSold,
    required this.availableVehicles,
    required this.reservedVehicles,
    required this.soldVehicles,
    required this.averageSalePrice,
    required this.sales,
  });

  final double totalRevenue;
  final int totalVehiclesSold;
  final int availableVehicles;
  final int reservedVehicles;
  final int soldVehicles;
  final double averageSalePrice;
  final List<SaleRow> sales;

  factory SalesReport.fromJson(Map<String, dynamic> json) {
    return SalesReport(
      totalRevenue: _toDouble(json['totalRevenue']),
      totalVehiclesSold: _toInt(json['totalVehiclesSold']),
      availableVehicles: _toInt(json['availableVehicles']),
      reservedVehicles: _toInt(json['reservedVehicles']),
      soldVehicles: _toInt(json['soldVehicles']),
      averageSalePrice: _toDouble(json['averageSalePrice']),
      sales: ((json['sales'] ?? []) as List).map((item) => SaleRow.fromJson(item)).toList(),
    );
  }
}

class SaleRow {
  SaleRow({
    required this.vehicleTitle,
    required this.salePrice,
    required this.saleDate,
    this.buyerName,
    this.buyerPhone,
  });

  final String vehicleTitle;
  final double salePrice;
  final String saleDate;
  final String? buyerName;
  final String? buyerPhone;

  factory SaleRow.fromJson(Map<String, dynamic> json) {
    return SaleRow(
      vehicleTitle: json['vehicleTitle']?.toString() ?? '',
      salePrice: _toDouble(json['salePrice']),
      saleDate: json['saleDate']?.toString() ?? '',
      buyerName: json['buyerName']?.toString(),
      buyerPhone: json['buyerPhone']?.toString(),
    );
  }
}

class InventoryPage extends StatefulWidget {
  const InventoryPage({required this.api, super.key});

  final ApiClient api;

  @override
  State<InventoryPage> createState() => _InventoryPageState();
}

class _InventoryPageState extends State<InventoryPage> {
  final searchController = TextEditingController();
  String status = 'AVAILABLE';
  bool loading = true;
  String? error;
  List<Vehicle> vehicles = [];

  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  Future<void> load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      vehicles = await widget.api.getVehicles(search: searchController.text, status: status);
    } catch (err) {
      error = err.toString();
    }
    if (mounted) setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: searchController,
            decoration: InputDecoration(
              hintText: 'Search by model, brand, color, number',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                onPressed: load,
                icon: const Icon(Icons.arrow_forward),
              ),
              border: const OutlineInputBorder(),
            ),
            onSubmitted: (_) => load(),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['AVAILABLE', 'RESERVED', 'SOLD', 'ALL'].map((item) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(item),
                    selected: status == item,
                    onSelected: (_) {
                      setState(() => status = item);
                      load();
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          if (loading) const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator())),
          if (error != null) ErrorPanel(message: error!, onRetry: load),
          if (!loading && error == null && vehicles.isEmpty)
            const EmptyPanel(icon: Icons.two_wheeler_outlined, title: 'No vehicles found', subtitle: 'Add a bike or change the search filter.'),
          for (final vehicle in vehicles)
            VehicleCard(
              vehicle: vehicle,
              onTap: () => showVehicleDetails(context, widget.api, vehicle.id, load),
            ),
        ],
      ),
    );
  }
}

class VehicleCard extends StatelessWidget {
  const VehicleCard({required this.vehicle, required this.onTap, super.key});

  final Vehicle vehicle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: SizedBox(
                  width: 92,
                  height: 72,
                  child: vehicle.thumbnailUrl == null
                      ? ColoredBox(
                          color: const Color(0xffe4ece7),
                          child: Icon(Icons.two_wheeler, color: Theme.of(context).colorScheme.primary),
                        )
                      : Image.network(vehicle.thumbnailUrl!, fit: BoxFit.cover),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vehicle.title, style: Theme.of(context).textTheme.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
                    Text('${vehicle.brand} ${vehicle.modelName} - ${vehicle.manufactureYear}'),
                    const SizedBox(height: 6),
                    Text(currencyFormat.format(vehicle.price), style: TextStyle(color: Theme.of(context).colorScheme.secondary, fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
              StatusPill(status: vehicle.status),
            ],
          ),
        ),
      ),
    );
  }
}

Future<void> showVehicleDetails(BuildContext context, ApiClient api, int id, Future<void> Function() onChanged) async {
  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    builder: (context) {
      return FutureBuilder<Vehicle>(
        future: api.getVehicle(id),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const SizedBox(height: 280, child: Center(child: CircularProgressIndicator()));
          }
          if (snapshot.hasError) {
            return Padding(
              padding: const EdgeInsets.all(16),
              child: ErrorPanel(message: snapshot.error.toString(), onRetry: () => Navigator.pop(context)),
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
                  if (vehicle.thumbnailUrl != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(vehicle.thumbnailUrl!, height: 220, fit: BoxFit.cover),
                    ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: Text(vehicle.title, style: Theme.of(context).textTheme.headlineSmall)),
                      StatusPill(status: vehicle.status),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(currencyFormat.format(vehicle.price), style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Theme.of(context).colorScheme.secondary, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      InfoChip(icon: Icons.speed, label: '${vehicle.kilometersDriven} km'),
                      InfoChip(icon: Icons.local_gas_station, label: vehicle.fuelType),
                      InfoChip(icon: Icons.calendar_month, label: '${vehicle.manufactureYear}'),
                      if (vehicle.color != null) InfoChip(icon: Icons.palette, label: vehicle.color!),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(vehicle.description ?? 'No description added.'),
                  const SizedBox(height: 20),
                  Text('Documents', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 8),
                  if (vehicle.documents.isEmpty) const Text('No documents uploaded yet.'),
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
                        MaterialPageRoute(builder: (_) => VehicleFormScreen(api: api, existing: vehicle)),
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
                      final confirmed = await confirm(context, 'Delete this bike?');
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
}

class VehicleFormScreen extends StatefulWidget {
  const VehicleFormScreen({required this.api, this.existing, super.key});

  final ApiClient api;
  final Vehicle? existing;

  @override
  State<VehicleFormScreen> createState() => _VehicleFormScreenState();
}

class _VehicleFormScreenState extends State<VehicleFormScreen> {
  final formKey = GlobalKey<FormState>();
  late final TextEditingController title;
  late final TextEditingController registrationNumber;
  late final TextEditingController brand;
  late final TextEditingController modelName;
  late final TextEditingController variantName;
  late final TextEditingController manufactureYear;
  late final TextEditingController registrationYear;
  late final TextEditingController kilometersDriven;
  late final TextEditingController ownerSerial;
  late final TextEditingController color;
  late final TextEditingController price;
  late final TextEditingController description;
  late final TextEditingController thumbnailUrl;
  late final TextEditingController location;
  late final TextEditingController imageUrl;
  List<Category> categories = [];
  int? categoryId;
  String fuelType = 'PETROL';
  String status = 'AVAILABLE';
  bool loading = true;
  bool saving = false;
  String? error;

  bool get isEditing => widget.existing != null;

  @override
  void initState() {
    super.initState();
    final vehicle = widget.existing;
    title = TextEditingController(text: vehicle?.title ?? '');
    registrationNumber = TextEditingController(text: vehicle?.registrationNumber ?? '');
    brand = TextEditingController(text: vehicle?.brand ?? '');
    modelName = TextEditingController(text: vehicle?.modelName ?? '');
    variantName = TextEditingController(text: vehicle?.variantName ?? '');
    manufactureYear = TextEditingController(text: vehicle?.manufactureYear.toString() ?? '');
    registrationYear = TextEditingController(text: vehicle?.registrationYear?.toString() ?? '');
    kilometersDriven = TextEditingController(text: vehicle?.kilometersDriven.toString() ?? '');
    ownerSerial = TextEditingController(text: vehicle?.ownerSerial?.toString() ?? '');
    color = TextEditingController(text: vehicle?.color ?? '');
    price = TextEditingController(text: vehicle?.price.toStringAsFixed(0) ?? '');
    description = TextEditingController(text: vehicle?.description ?? '');
    thumbnailUrl = TextEditingController(text: vehicle?.thumbnailUrl ?? '');
    location = TextEditingController(text: vehicle?.location ?? '');
    imageUrl = TextEditingController(text: vehicle?.images.isNotEmpty == true ? vehicle!.images.first.imageUrl : vehicle?.thumbnailUrl ?? '');
    fuelType = vehicle?.fuelType ?? 'PETROL';
    status = vehicle?.status ?? 'AVAILABLE';
    categoryId = vehicle?.category?.id;
    loadCategories();
  }

  @override
  void dispose() {
    for (final controller in [
      title,
      registrationNumber,
      brand,
      modelName,
      variantName,
      manufactureYear,
      registrationYear,
      kilometersDriven,
      ownerSerial,
      color,
      price,
      description,
      thumbnailUrl,
      location,
      imageUrl,
    ]) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> loadCategories() async {
    try {
      categories = await widget.api.getCategories();
      categoryId ??= categories.isEmpty ? null : categories.first.id;
    } catch (err) {
      error = err.toString();
    }
    if (mounted) setState(() => loading = false);
  }

  Future<void> save() async {
    if (!formKey.currentState!.validate()) return;
    if (categoryId == null) {
      showSnack(context, 'Please create a category first');
      return;
    }
    setState(() => saving = true);
    try {
      final draft = VehicleDraft(
        title: title.text.trim(),
        registrationNumber: registrationNumber.text.trim(),
        brand: brand.text.trim(),
        modelName: modelName.text.trim(),
        variantName: variantName.text.trim(),
        manufactureYear: int.parse(manufactureYear.text),
        registrationYear: _nullableInt(registrationYear.text),
        kilometersDriven: int.parse(kilometersDriven.text),
        fuelType: fuelType,
        ownerSerial: _nullableInt(ownerSerial.text),
        color: color.text.trim(),
        price: double.parse(price.text),
        description: description.text.trim(),
        status: status,
        categoryId: categoryId!,
        thumbnailUrl: thumbnailUrl.text.trim(),
        location: location.text.trim(),
        imageUrl: imageUrl.text.trim(),
      );
      await widget.api.saveVehicle(draft, id: widget.existing?.id);
      if (mounted) {
        showSnack(context, isEditing ? 'Bike updated' : 'Bike added');
        if (isEditing) Navigator.pop(context);
        formKey.currentState!.reset();
      }
    } catch (err) {
      if (mounted) showSnack(context, err.toString());
    }
    if (mounted) setState(() => saving = false);
  }

  @override
  Widget build(BuildContext context) {
    final content = loading
        ? const Center(child: CircularProgressIndicator())
        : Form(
            key: formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (error != null) ErrorPanel(message: error!, onRetry: loadCategories),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<int>(
                        value: categoryId,
                        decoration: const InputDecoration(labelText: 'Category', border: OutlineInputBorder()),
                        items: categories.map((category) => DropdownMenuItem(value: category.id, child: Text(category.name))).toList(),
                        onChanged: (value) => setState(() => categoryId = value),
                        validator: (value) => value == null ? 'Required' : null,
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton.filledTonal(
                      onPressed: createCategory,
                      icon: const Icon(Icons.add),
                      tooltip: 'Add category',
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                textField(title, 'Bike title', required: true),
                textField(registrationNumber, 'Registration number'),
                Row(children: [
                  Expanded(child: textField(brand, 'Brand', required: true)),
                  const SizedBox(width: 8),
                  Expanded(child: textField(modelName, 'Model', required: true)),
                ]),
                textField(variantName, 'Variant'),
                Row(children: [
                  Expanded(child: numberField(manufactureYear, 'Manufacture year', required: true)),
                  const SizedBox(width: 8),
                  Expanded(child: numberField(registrationYear, 'Registration year')),
                ]),
                Row(children: [
                  Expanded(child: numberField(kilometersDriven, 'Kilometers', required: true)),
                  const SizedBox(width: 8),
                  Expanded(child: numberField(ownerSerial, 'Owner count')),
                ]),
                Row(children: [
                  Expanded(
                    child: dropdown('Fuel', fuelType, ['PETROL', 'ELECTRIC', 'HYBRID', 'OTHER'], (value) => setState(() => fuelType = value)),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: dropdown('Status', status, ['AVAILABLE', 'RESERVED', 'SOLD'], (value) => setState(() => status = value)),
                  ),
                ]),
                textField(color, 'Color'),
                numberField(price, 'Price', required: true),
                textField(location, 'Location'),
                textField(thumbnailUrl, 'Thumbnail image URL'),
                textField(imageUrl, 'Gallery image URL'),
                textField(description, 'Description', maxLines: 4),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: saving ? null : save,
                  icon: saving ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)) : const Icon(Icons.save),
                  label: Text(isEditing ? 'Update bike' : 'Add bike'),
                ),
              ],
            ),
          );

    if (!isEditing) return content;

    return Scaffold(
      appBar: AppBar(title: const Text('Edit bike')),
      body: content,
    );
  }

  Widget textField(TextEditingController controller, String label, {bool required = false, int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
        validator: required ? (value) => value == null || value.trim().isEmpty ? 'Required' : null : null,
      ),
    );
  }

  Widget numberField(TextEditingController controller, String label, {bool required = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
        validator: (value) {
          if (required && (value == null || value.trim().isEmpty)) return 'Required';
          if (value != null && value.trim().isNotEmpty && num.tryParse(value) == null) return 'Invalid number';
          return null;
        },
      ),
    );
  }

  Widget dropdown(String label, String value, List<String> options, ValueChanged<String> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String>(
        value: value,
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
        items: options.map((option) => DropdownMenuItem(value: option, child: Text(option))).toList(),
        onChanged: (value) {
          if (value != null) onChanged(value);
        },
      ),
    );
  }

  Future<void> createCategory() async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add category'),
          content: TextField(controller: controller, decoration: const InputDecoration(labelText: 'Name')),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(context, controller.text.trim()), child: const Text('Create')),
          ],
        );
      },
    );
    controller.dispose();
    if (name == null || name.isEmpty) return;
    try {
      final category = await widget.api.createCategory(name);
      setState(() {
        categories = [...categories, category];
        categoryId = category.id;
      });
    } catch (err) {
      if (mounted) showSnack(context, err.toString());
    }
  }
}

class ReportsPage extends StatefulWidget {
  const ReportsPage({required this.api, super.key});

  final ApiClient api;

  @override
  State<ReportsPage> createState() => _ReportsPageState();
}

class _ReportsPageState extends State<ReportsPage> {
  late Future<SalesReport> reportFuture;

  @override
  void initState() {
    super.initState();
    reportFuture = widget.api.getSalesReport();
  }

  void refresh() {
    setState(() => reportFuture = widget.api.getSalesReport());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SalesReport>(
      future: reportFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: ErrorPanel(message: snapshot.error.toString(), onRetry: refresh),
          );
        }
        final report = snapshot.data!;
        return RefreshIndicator(
          onRefresh: () async => refresh(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  MetricCard(label: 'Revenue', value: currencyFormat.format(report.totalRevenue)),
                  MetricCard(label: 'Sold', value: report.totalVehiclesSold.toString()),
                  MetricCard(label: 'Available', value: report.availableVehicles.toString()),
                  MetricCard(label: 'Reserved', value: report.reservedVehicles.toString()),
                ],
              ),
              const SizedBox(height: 20),
              Text('Recent sales', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              if (report.sales.isEmpty)
                const EmptyPanel(icon: Icons.receipt_long_outlined, title: 'No sales yet', subtitle: 'Sold bikes will appear here.'),
              for (final sale in report.sales)
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.receipt_long_outlined),
                    title: Text(sale.vehicleTitle),
                    subtitle: Text([sale.saleDate, sale.buyerName, sale.buyerPhone].where((item) => item != null && item.isNotEmpty).join(' - ')),
                    trailing: Text(currencyFormat.format(sale.salePrice), style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class MetricCard extends StatelessWidget {
  const MetricCard({required this.label, required this.value, super.key});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
              const SizedBox(height: 8),
              Text(value, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}

class StatusPill extends StatelessWidget {
  const StatusPill({required this.status, super.key});

  final String status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      'AVAILABLE' => const Color(0xff1f6f54),
      'RESERVED' => const Color(0xffa15c00),
      'SOLD' => const Color(0xff686d74),
      _ => Theme.of(context).colorScheme.primary,
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(99)),
      child: Text(status, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11)),
    );
  }
}

class InfoChip extends StatelessWidget {
  const InfoChip({required this.icon, required this.label, super.key});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Chip(avatar: Icon(icon, size: 18), label: Text(label));
  }
}

class EmptyPanel extends StatelessWidget {
  const EmptyPanel({required this.icon, required this.title, required this.subtitle, super.key});

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          children: [
            Icon(icon, size: 42, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 8),
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(subtitle, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}

class ErrorPanel extends StatelessWidget {
  const ErrorPanel({required this.message, required this.onRetry, super.key});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Something went wrong', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 6),
            Text(message),
            const SizedBox(height: 10),
            OutlinedButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}

Future<void> uploadDocumentFlow(BuildContext context, ApiClient api, int vehicleId) async {
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
                    value: type,
                    items: ['RC', 'INSURANCE', 'PUC', 'NOC', 'FORM_29', 'FORM_30', 'SALE_INVOICE', 'OTHER']
                        .map((item) => DropdownMenuItem(value: item, child: Text(item)))
                        .toList(),
                    onChanged: (value) => setState(() => type = value ?? 'OTHER'),
                    decoration: const InputDecoration(labelText: 'Type'),
                  ),
                  TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Title')),
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Pick file')),
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
      title: titleController.text.trim().isEmpty ? file.name : titleController.text.trim(),
      type: type,
    );
    if (context.mounted) showSnack(context, 'Document uploaded');
  } finally {
    titleController.dispose();
  }
}

Future<void> markSoldFlow(BuildContext context, ApiClient api, Vehicle vehicle) async {
  final priceController = TextEditingController(text: vehicle.price.toStringAsFixed(0));
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
                TextField(controller: priceController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Sale price')),
                TextField(controller: buyerNameController, decoration: const InputDecoration(labelText: 'Buyer name')),
                TextField(controller: buyerPhoneController, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Buyer phone')),
                TextField(controller: notesController, decoration: const InputDecoration(labelText: 'Notes')),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Save sale')),
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
    if (context.mounted) showSnack(context, 'Sale saved');
  } finally {
    priceController.dispose();
    buyerNameController.dispose();
    buyerPhoneController.dispose();
    notesController.dispose();
  }
}

Future<bool> confirm(BuildContext context, String title) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
        FilledButton(onPressed: () => Navigator.pop(context, true), child: const Text('Confirm')),
      ],
    ),
  );
  return result ?? false;
}

void showSnack(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}

int _toInt(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  return int.tryParse(value?.toString() ?? '') ?? 0;
}

double _toDouble(dynamic value) {
  if (value is double) return value;
  if (value is num) return value.toDouble();
  return double.tryParse(value?.toString() ?? '') ?? 0;
}

int? _nullableInt(String value) {
  if (value.trim().isEmpty) return null;
  return int.parse(value);
}

String? _emptyToNull(String value) {
  return value.trim().isEmpty ? null : value.trim();
}
