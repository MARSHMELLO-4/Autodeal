import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/vehicle_card.dart';

void main() {
  testWidgets(
    'VehicleCard lays out inside a sliver list without infinite height',
    (WidgetTester tester) async {
      final vehicle = Vehicle(
        id: 1,
        title: 'Honda Shine 125',
        brand: 'Honda',
        modelName: 'Shine',
        manufactureYear: 2021,
        kilometersDriven: 12345,
        fuelType: 'PETROL',
        price: 65000,
        status: 'AVAILABLE',
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ListView.builder(
              itemCount: 5,
              itemBuilder: (context, index) => VehicleCard(
                vehicle: vehicle,
                onTap: () {},
                onAiShare: () {},
              ),
            ),
          ),
        ),
      );

      expect(find.text('Honda Shine 125'), findsAtLeastNWidgets(1));
      expect(find.text('Rs. 65,000'), findsAtLeastNWidgets(1));
      expect(find.text('AVAILABLE'), findsAtLeastNWidgets(1));
    },
  );
}