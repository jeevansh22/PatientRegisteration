const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const bodyParser=require('body-parser')
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/patient', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        minlength: 10,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /\S+@\S+\.\S+/,
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    },
    patientPhoto: {
        type: String,
        required: true,
    },
    psychiatristId: {
        type: mongoose.Schema.Types.Number,
        required: true,
        ref: 'Psychiatrist'
    }
});

const psychiatristSchema = new mongoose.Schema({
    _id: Number, 
    name: String,
    hospitalId: Number
});

const Patient = mongoose.model('Patient', patientSchema);
const Psychiatrist = mongoose.model('Psychiatrist', psychiatristSchema);
const hospitals = [
    { id: 1, name: "Apollo Hospitals" },
    { id: 2, name: "Jawaharlal Nehru Medical College and Hospital" },
    { id: 3, name: "Indira Gandhi Institute of Medical Sciences (IGIMS)" },
    { id: 4, name: "AIIMS - All India Institute Of Medical Science" }
];

app.use(bodyParser.json());

app.post('/register-patient', async (req, res) => {
    console.log("Request body:", req.body);

    const { name, address, email, phoneNumber, password, patientPhoto, psychiatristId } = req.body;
console.log(name, address, email, phoneNumber, password, patientPhoto, psychiatristId )
    if (!name || !address || !email || !password || !patientPhoto || !psychiatristId) {
        console.log("Missing fields:", { name, address, email, phoneNumber, password, patientPhoto, psychiatristId }); // Log which fields are missing
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (address.length < 10) {
        return res.status(400).json({ message: "Address should be at least 10 characters" });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ message: "Password must contain one upper character, one lower character, a number, and be between 8 to 15 characters" });
    }

    try {
        const psychiatrist = await Psychiatrist.findOne({ _id: psychiatristId });
        console.log(psychiatrist)
        if (!psychiatrist) {
            return res.status(404).json({ message: "Psychiatrist not found" });
        }

        const newPatient = new Patient({ name, address, email, phoneNumber, password, patientPhoto, psychiatristId });
        await newPatient.save();
        res.status(200).json({ message: "Patient registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering patient", error: err.message });
    }
});

app.get('/hospital-psychiatrists', async (req, res) => {
    const { hospitalId } = req.body;
    
    if (!hospitalId) {
        return res.status(400).json({ message: "Hospital ID is required" });
    }

    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) {
        return res.status(404).json({ message: "Hospital not found" });
    }

    try {
        const psychiatristsForHospital = await Psychiatrist.find({ hospitalId });

        const psychiatristDetails = await Promise.all(
            psychiatristsForHospital.map(async psychiatrist => {
                const patientsCount = await Patient.countDocuments({ psychiatristId: psychiatrist._id });
                return {
                    id: psychiatrist._id,
                    name: psychiatrist.name,
                    patientsCount
                };
            })
        );

        const totalPatientsCount = await Patient.countDocuments({ psychiatristId: { $in: psychiatristsForHospital.map(p => p._id) } });

        res.status(200).json({
            hospitalName: hospital.name,
            totalPsychiatristCount: psychiatristsForHospital.length,
            totalPatientsCount: totalPatientsCount,
            psychiatristDetails
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePhoneNumber(phoneNumber) {
    return phoneNumber.length >= 10;
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    return re.test(password);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
