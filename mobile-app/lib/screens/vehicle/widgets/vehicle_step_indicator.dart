import 'package:flutter/material.dart';

class VehicleStepIndicator extends StatelessWidget {
  const VehicleStepIndicator({
    required this.currentStep,
    required this.steps,
    required this.onStepTap,
    super.key,
  });

  final int currentStep;
  final List<String> steps;
  final ValueChanged<int> onStepTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: Row(
            children: List.generate(
              steps.length,
                  (index) {
                final isCurrent = index == currentStep;
                final isCompleted = index < currentStep;

                return Row(
                  children: [
                    InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: index <= currentStep
                          ? () => onStepTap(index)
                          : null,
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 14,
                            backgroundColor:
                            isCurrent || isCompleted
                                ? colorScheme.primary
                                : colorScheme.surfaceContainerHighest,
                            child: isCompleted
                                ? const Icon(
                              Icons.check,
                              size: 16,
                              color: Colors.white,
                            )
                                : Text(
                              '${index + 1}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isCurrent
                                    ? Colors.white
                                    : colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            steps[index],
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isCurrent
                                  ? FontWeight.bold
                                  : FontWeight.w500,
                              color: isCurrent || isCompleted
                                  ? colorScheme.primary
                                  : colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (index < steps.length - 1)
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                        ),
                        child: Container(
                          width: 28,
                          height: 1,
                          color: Colors.grey.shade300,
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        ),

        LinearProgressIndicator(
          value: (currentStep + 1) / steps.length,
          minHeight: 3,
        ),
      ],
    );
  }
}