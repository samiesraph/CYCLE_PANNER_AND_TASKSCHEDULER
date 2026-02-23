import random
import pandas as pd

def generate_synthetic_data(n_samples=2000):
    data = []

    for _ in range(n_samples):
        age = random.randint(12, 55)

        # Menopause flag (non-diagnostic)
        if age >= 45:
            menopause = random.choice([0, 1])
        else:
            menopause = 0

        # Cycle phase relevance reduces after menopause
        cycle_phase = random.randint(0, 3) if menopause == 0 else random.randint(1, 3)

        sleep_hours = round(random.uniform(4, 9), 1)
        mood = random.randint(1, 5)
        stress = random.randint(1, 5)
        symptoms = random.randint(0, 3)
        activity = random.randint(0, 2)

        # Base energy by cycle phase
        phase_energy = {
            0: 40,  # Menstrual
            1: 65,
            2: 80,
            3: 55
        }

        base_energy = phase_energy.get(cycle_phase, 60)

        # Age modifier
        if age < 18:
            age_modifier = random.randint(-5, 5)
        elif age <= 35:
            age_modifier = 5
        elif age <= 44:
            age_modifier = 0
        else:
            age_modifier = -8

        menopause_modifier = -10 if menopause == 1 else 0

        energy = (
            base_energy
            + (sleep_hours - 7) * 5
            + mood * 3
            - stress * 4
            - symptoms * 5
            + activity * 2
            + age_modifier
            + menopause_modifier
        )

        energy = max(20, min(95, int(energy)))

        data.append([
            age,
            menopause,
            cycle_phase,
            sleep_hours,
            mood,
            stress,
            symptoms,
            activity,
            energy
        ])

    columns = [
        "age",
        "menopause_flag",
        "cycle_phase",
        "sleep_hours",
        "mood",
        "stress",
        "symptoms",
        "activity",
        "energy_score"
    ]

    return pd.DataFrame(data, columns=columns)


if __name__ == "__main__":
    df = generate_synthetic_data()
    df.to_csv("synthetic_energy_dataset.csv", index=False)
    print("Dataset generated successfully!")
