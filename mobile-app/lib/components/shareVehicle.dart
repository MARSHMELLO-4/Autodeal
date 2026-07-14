import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;
Future<void> shareVehicle(Vehicle vehicle) async {
  final images = await downloadImages(vehicle);

  const phone = "+918982883521";
  const website = "https://shreeganeshautodeal.com";
  const address =
      "Shree Ganesh Autodeal, Vikas Rekha Complex Tower, 11/3, Khatiwala Tank, Indore, Madhya Pradesh 452014";

  const googleMaps =
      "https://maps.app.goo.gl/8quUjXQtXj9wuZ966"; // Replace with your showroom coordinates

  final message = '''
🏍 *${vehicle.title}*

💰 Price: ${currencyFormat.format(vehicle.price)}

📅 Model Year: ${vehicle.manufactureYear}

⛽ Fuel Type: ${vehicle.fuelType}

🛣 Driven: ${vehicle.kilometersDriven} km

${vehicle.color != null ? "🎨 Color: ${vehicle.color}\n" : ""}

${vehicle.description ?? ""}

━━━━━━━━━━━━━━━━━━━━

📍 Address:
$address

🗺 Google Maps:
$googleMaps

🌐 Website:
$website

📞 Call / WhatsApp:
$phone

✨ Visit our showroom for inspection and best deals.
''';

  await Share.shareXFiles(
    images,
    text: message,
  );
}

Future<List<XFile>> downloadImages(Vehicle vehicle) async {

  final temp = await getTemporaryDirectory();

  List<XFile> files = [];

  for (var i = 0; i < vehicle.images.length; i++) {

    final response =
    await http.get(Uri.parse(vehicle.images[i].imageUrl));

    final file = File("${temp.path}/bike_$i.jpg");

    await file.writeAsBytes(response.bodyBytes);

    files.add(XFile(file.path));
  }

  return files;
}