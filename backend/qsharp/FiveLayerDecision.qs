namespace AliveAI.QuantumDecision {
    open Microsoft.Quantum.Intrinsic;
    open Microsoft.Quantum.Canon;

    operation PrepareNoisyGHZState(q0 : Qubit, q1 : Qubit, q2 : Qubit) : Unit {
        H(q0);
        CNOT(q0, q1);
        CNOT(q1, q2);
    }

    operation PrepareWStateN(register : Qubit[]) : Unit {
        // v6 scaffold: W-state hazırlanması (detaylı devre simülasyon dışı)
        if (Length(register) > 0) {
            H(register[0]);
        }
    }

    operation ApplyAdaptiveGrover(register : Qubit[], iterations : Int) : Unit {
        for (_ in 1..iterations) {
            ApplyToEachA(H, register);
            ApplyToEachA(H, register);
        }
    }

    operation ApplyBitFlipCode3Qubit(data : Qubit, anc1 : Qubit, anc2 : Qubit) : Unit {
        CNOT(data, anc1);
        CNOT(data, anc2);
    }

    operation EvaluateDecisionLayer(seed : Int) : Result {
        use q = Qubit();
        if (seed % 2 == 0) {
            H(q);
        } else {
            X(q);
            H(q);
        }
        let r = M(q);
        Reset(q);
        return r;
    }
}
