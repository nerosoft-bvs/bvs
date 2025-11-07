function inputFields() {
    const requiredFields = document.querySelectorAll("[data-required='true']");
    const inputFields = document.querySelectorAll("input");
    const selectionField = document.querySelectorAll("select");

    // Merge NodeLists into one array
    const allFields = [...inputFields, ...selectionField];

    allFields.forEach(field => {
        if (field.value.trim()) {
            field.classList.add("valued");
        }
    });

    requiredFields.forEach(function (field) {
        // Initial check
        if (field.value.trim()) {
            field.classList.add("is-valid");
        }

        // On blur
        field.addEventListener("blur", function () {
            let feedback = field.nextElementSibling;
            if (field.classList.contains("ff-condition")){
                field.classList.remove("valued");
                return
            }
            if (!field.value.trim()) {
                field.classList.add("is-invalid");
                field.classList.remove("is-valid", "valued");
                // show feedback
                if (!feedback || !feedback.classList.contains("invalid-feedback")) {
                    feedback = document.createElement("div");
                    feedback.classList.add("invalid-feedback");
                    feedback.innerText = "* This field is required.";
                    field.insertAdjacentElement("afterend", feedback);
                }

                feedback.style.display = "block";
            } else {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
                feedback.style.display = "none";

                if (feedback && feedback.classList.contains("invalid-feedback")) {
                feedback.style.display = "none";
                }
            }
        });

        // On typing
        field.addEventListener("input", function () {
            if (field.value.trim()) {
                field.classList.remove("is-invalid");
                field.classList.add("is-valid");
            }
        });




    });

//
}

//function validateDateBeforeToday() {
//    const fields = document.querySelectorAll(".date-before-validation");
//
//    const today = new Date();
//    today.setHours(0, 0, 0, 0); // Normalize to midnight
//
//    fields.forEach(field => {
//        const value = field.value.trim();
//
//        // Remove any existing feedback
//        let feedback = field.nextElementSibling;
//        if (feedback && feedback.classList.contains("invalid-feedback")) {
//            feedback.remove();
//        }
//
//        if (value) {
//            const inputDate = new Date(value);
//
//            if (inputDate < today) {
//                // ✅ Valid: before today
//                field.classList.remove("is-invalid");
//                field.classList.add("is-valid");
//            } else {
//                // ❌ Invalid: today or in future
//                field.classList.remove("is-valid");
//                field.classList.add("is-invalid");
//
//            }
//        } else {
//            // Empty → just remove states
//            field.classList.remove("is-valid", "is-invalid");
//        }
//    });
//}


// 🔹 Run immediately if DOM is ready, otherwise wait
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inputFields);
//    document.addEventListener("input", function(e) {
//    if (e.target.classList.contains("date-before-validation")) {
//        validateDateBeforeToday();
//    }
} else {
    inputFields();
}
