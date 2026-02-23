import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateInference, decayState, getInferenceLabel, EVENTS } from '../utils/inferenceEngine';

const InferenceContext = createContext();

export const useInference = () => useContext(InferenceContext);

export const InferenceProvider = ({ children }) => {
    // Initialize with baseline values
    const [inferenceState, setInferenceState] = useState(() => {
        const saved = localStorage.getItem('sakura_inference_state');
        return saved ? JSON.parse(saved) : { mood: 5, energy: 5, lastUpdate: Date.now() };
    });

    const [isEnabled, setIsEnabled] = useState(() => {
        const saved = localStorage.getItem('sakura_inference_enabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sakura_inference_state', JSON.stringify(inferenceState));
    }, [inferenceState]);

    useEffect(() => {
        localStorage.setItem('sakura_inference_enabled', JSON.stringify(isEnabled));
    }, [isEnabled]);

    // Decay effect - periodically normalize values towards baseline
    useEffect(() => {
        if (!isEnabled) return;

        const interval = setInterval(() => {
            setInferenceState(current => {
                const { mood, energy } = decayState(current.mood, current.energy);
                return { ...current, mood, energy, lastUpdate: Date.now() };
            });
        }, 60000 * 30); // Run every 30 minutes

        return () => clearInterval(interval);
    }, [isEnabled]);

    const logSignal = (type, data = {}) => {
        if (!isEnabled) return;

        setInferenceState(current => {
            const { mood, energy } = calculateInference(current.mood, current.energy, { type, data });
            return { ...current, mood, energy, lastUpdate: Date.now() };
        });
    };

    const resetInference = () => {
        setInferenceState({ mood: 5, energy: 5, lastUpdate: Date.now() });
    };

    const toggleInference = (value) => {
        setIsEnabled(value);
    };

    const getInsights = () => {
        return {
            mood: {
                value: inferenceState.mood,
                label: getInferenceLabel(inferenceState.mood)
            },
            energy: {
                value: inferenceState.energy,
                label: getInferenceLabel(inferenceState.energy)
            }
        };
    };

    return (
        <InferenceContext.Provider value={{
            inferenceState,
            logSignal,
            getInsights,
            EVENTS,
            isEnabled,
            toggleInference,
            resetInference
        }}>
            {children}
        </InferenceContext.Provider>
    );
};
