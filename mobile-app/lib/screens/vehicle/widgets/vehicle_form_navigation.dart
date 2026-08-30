import 'package:flutter/material.dart';

class VehicleFormNavigation extends StatelessWidget {
  const VehicleFormNavigation({
    required this.currentStep,
    required this.totalSteps,
    required this.onBack,
    required this.onNext,
    required this.onSave,
    this.saving = false,
    super.key,
  });

  final int currentStep;
  final int totalSteps;

  final VoidCallback onBack;
  final VoidCallback onNext;
  final VoidCallback onSave;

  final bool saving;

  @override
  Widget build(BuildContext context) {
    final isFirstStep = currentStep == 0;
    final isLastStep = currentStep == totalSteps - 1;

    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        child: Row(
          children: [
            if (!isFirstStep)
              OutlinedButton.icon(
                onPressed: saving ? null : onBack,
                icon: const Icon(Icons.arrow_back),
                label: const Text('Back'),
              ),

            if (!isFirstStep) const Spacer(),

            if (isFirstStep)
              const Spacer(),

            FilledButton.icon(
              onPressed: saving
                  ? null
                  : isLastStep
                  ? onSave
                  : onNext,
              icon: saving
                  ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                ),
              )
                  : Icon(
                isLastStep
                    ? Icons.check
                    : Icons.arrow_forward,
              ),
              label: Text(
                saving
                    ? 'Saving...'
                    : isLastStep
                    ? 'Add Vehicle'
                    : 'Next',
              ),
            ),
          ],
        ),
      ),
    );
  }
}