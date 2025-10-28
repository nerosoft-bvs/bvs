/**
 * Initialize input field validation and UX enhancements
 * Provides real-time validation feedback for required fields
 */
function inputFields() {
    // Safe DOM querying with null checks
    const requiredFields = document.querySelectorAll("[data-required='true']");
    const inputFields = document.querySelectorAll("input");
    const selectionField = document.querySelectorAll("select");

    // Check if any elements exist
    if (!requiredFields || requiredFields.length === 0) {
        console.warn('FormUX: No required fields found');
        return;
    }

    // Merge NodeLists into one array safely
    const allFields = [];
    try {
        allFields.push(...inputFields);
        allFields.push(...selectionField);
    } catch (e) {
        console.error('FormUX: Failed to merge field lists:', e);
        return;
    }

    // Add "valued" class to fields with content
    allFields.forEach(field => {
        try {
            if (field && field.value && field.value.trim()) {
                field.classList.add("valued");
            }
        } catch (e) {
            console.error('FormUX: Error processing field:', e);
        }
    });

    // Setup validation for required fields
    requiredFields.forEach(function (field) {
        if (!field) return;

        try {
            // Initial validation check
            if (field.value && field.value.trim()) {
                field.classList.add("is-valid");
            }

            // Blur event - show validation on field exit
            field.addEventListener("blur", function () {
                try {
                    let feedback = field.nextElementSibling;

                    // Skip conditional fields
                    if (field.classList.contains("ff-condition")) {
                        field.classList.remove("valued");
                        return;
                    }

                    // Validate field value
                    if (!field.value || !field.value.trim()) {
                        field.classList.add("is-invalid");
                        field.classList.remove("is-valid", "valued");

                        // Create or show feedback message
                        if (!feedback || !feedback.classList.contains("invalid-feedback")) {
                            feedback = document.createElement("div");
                            feedback.classList.add("invalid-feedback");
                            feedback.innerText = "* This field is required.";
                            field.insertAdjacentElement("afterend", feedback);
                        }

                        if (feedback) {
                            feedback.style.display = "block";
                        }
                    } else {
                        field.classList.remove("is-invalid");
                        field.classList.add("is-valid");

                        // Hide feedback if exists
                        if (feedback && feedback.classList.contains("invalid-feedback")) {
                            feedback.style.display = "none";
                        }
                    }
                } catch (e) {
                    console.error('FormUX: Error in blur handler:', e);
                }
            });

            // Input event - real-time validation
            field.addEventListener("input", function () {
                try {
                    if (field.value && field.value.trim()) {
                        field.classList.remove("is-invalid");
                        field.classList.add("is-valid");

                        // Hide feedback if exists
                        const feedback = field.nextElementSibling;
                        if (feedback && feedback.classList.contains("invalid-feedback")) {
                            feedback.style.display = "none";
                        }
                    }
                } catch (e) {
                    console.error('FormUX: Error in input handler:', e);
                }
            });
        } catch (e) {
            console.error('FormUX: Failed to setup field validation:', e);
        }
    });
}

/**
 * Validate date is before today
 * Optional date validation for historical dates
 */
function validateDateBeforeToday() {
    try {
        const fields = document.querySelectorAll(".date-before-validation");

        if (!fields || fields.length === 0) {
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        fields.forEach(field => {
            if (!field) return;

            try {
                const value = field.value ? field.value.trim() : '';

                // Remove any existing feedback
                let feedback = field.nextElementSibling;
                if (feedback && feedback.classList.contains("invalid-feedback")) {
                    feedback.remove();
                }

                if (value) {
                    const inputDate = new Date(value);

                    // Check if valid date
                    if (isNaN(inputDate.getTime())) {
                        field.classList.remove("is-valid");
                        field.classList.add("is-invalid");
                        return;
                    }

                    if (inputDate < today) {
                        // Valid: before today
                        field.classList.remove("is-invalid");
                        field.classList.add("is-valid");
                    } else {
                        // Invalid: today or in future
                        field.classList.remove("is-valid");
                        field.classList.add("is-invalid");
                    }
                } else {
                    // Empty - just remove states
                    field.classList.remove("is-valid", "is-invalid");
                }
            } catch (e) {
                console.error('FormUX: Error validating date field:', e);
            }
        });
    } catch (e) {
        console.error('FormUX: Error in validateDateBeforeToday:', e);
    }
}

/**
 * Initialize form UX on DOM ready
 * Runs immediately if DOM is ready, otherwise waits for DOMContentLoaded
 */
try {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            try {
                inputFields();
                // Uncomment if date validation is needed:
                // validateDateBeforeToday();
            } catch (e) {
                console.error('FormUX: Error in DOMContentLoaded handler:', e);
            }
        });

        // Optional: Add date validation listener
        // document.addEventListener("input", function(e) {
        //     if (e.target && e.target.classList && e.target.classList.contains("date-before-validation")) {
        //         validateDateBeforeToday();
        //     }
        // });
    } else {
        inputFields();
        // Uncomment if date validation is needed:
        // validateDateBeforeToday();
    }
} catch (e) {
    console.error('FormUX: Failed to initialize:', e);
}
