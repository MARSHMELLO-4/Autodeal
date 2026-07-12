import 'package:flutter_test/flutter_test.dart';
import 'package:shree_ganesh_autodeal_admin/main.dart';

void main() {
  testWidgets('renders the admin app shell', (WidgetTester tester) async {
    await tester.pumpWidget(const AutodealAdminApp());

    expect(find.text('Shree Ganesh Autodeal'), findsOneWidget);
    expect(find.text('Stock'), findsOneWidget);
    expect(find.text('Add'), findsOneWidget);
    expect(find.text('Reports'), findsOneWidget);
  });
}
