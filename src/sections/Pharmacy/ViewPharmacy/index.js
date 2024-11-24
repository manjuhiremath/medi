import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  TextField,
  Chip,
  Stack,
  Switch
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useRouter } from '../../../routes/hooks';
import { FormSection } from '../../../_mock/components';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PopUp from '../../../components/popup';
import Loading from '../../../components/loading';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLocation } from 'react-router-dom';
import DraggableList from './dragable'
import { usePharmacyContext } from '../../../firebase/PharmacyService';
import { useDropdown } from '../../../firebase/DropdownService';

function ViewPharmacy() {
  const router = useRouter();
  const handleBackHospitalClick = () => {
    router.push('/Pharmacies');
  };
  const { updatePharmacy, loading, setLoading } = usePharmacyContext();
  const [popUp, setPopUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMain, setErrorMain] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');
  const [insuranceInput, setInsuranceInput] = useState('');
  const [KeyWordsName, setKeyWordsName] = useState('');
  const location = useLocation();
  const { state } = location;
  const [images, setImages] = useState([]);
  const [hospitalData, setHospitalData] = useState({
    name: '',
    specialties: [],
    area: '',
    pincode: '',
    longitude: '',
    latitude: '',
    KeyWords: [],
    isPublished: false,
    isActive: false,
    image: [],
    city: '',
    emergencyServices: false,
    mapLink: '',
    phoneNumber: '',
  });

  const [fetchedDetails, setFetchedDetails] = useState({
    profile: {
      description: '',
    },
    location: {
      address: '',
    },
    contact: {
      alternateNumber: '',
      website: '',
      socialMedia: '',
      email: ''
    },
    insurance: {
      insuranceAccepted: false,
      insuranceNames: []
    }
  });

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const hospitalRef = doc(db, "services", state.id);
        const hospitalSnap = await getDoc(hospitalRef);

        if (hospitalSnap.exists()) {
          const data = hospitalSnap.data();
          const imageData = data.image || [];
          const imageItems = imageData.map((img, index) => ({
            sequenceNo: img.sequenceNo || '',
            isPublished: img.isPublished || false,
            imageUrl: img.imageUrl || '',
          }));

          setHospitalData({
            name: data.name || '',
            specialties: data.specialties || [],
            area: data.area || '',
            pincode: data.pincode || '',
            longitude: data.longitude || '',
            latitude: data.latitude || '',
            KeyWords: data.KeyWords || [],
            isPublished: data.isPublished || false,
            isActive: data.isActive || false,
            city: data.city || '',
            mapLink: data.mapLink || '',
            emergencyServices: data.emergencyServices || false,
            phoneNumber: data.phoneNumber || '',

          });
          setImages(imageItems);
          const detailRef = collection(hospitalRef, 'details');
          const detailSnapshot = await getDocs(detailRef);
          const fetchedDetails = detailSnapshot.docs.map(detailDoc => ({
            id: detailDoc.id,
            ...detailDoc.data()
          }));

          setFetchedDetails({
            profile: {
              description: fetchedDetails[0].profile.description,

            },
            location: {
              address: fetchedDetails[0].location?.address || '',
            },

            contact: {
              alternateNumber: fetchedDetails[0].contact?.alternateNumber || '',
              website: fetchedDetails[0].contact?.website || '',
              socialMedia: fetchedDetails[0].contact.socialMedia || '',
              email: fetchedDetails[0].contact?.email || ''
            },
            insurance: {
              insuranceAccepted: fetchedDetails[0].insurance?.insuranceAccepted || false,
              insuranceNames: fetchedDetails[0].insurance?.insuranceNames || []
            }
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching hospital data: ", error);
      }
    };

    fetchHospitalData();
  }, [state.id]);

  const validateField = (name, value, formData = {}) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value) { error = 'Hospital name is required' } else { setErrorMain('') };
        break;
      case 'alternateNumber':
        if (!value) error = 'Alternate phone number is required';
        else if (!validatePhoneNumber(value)) {
          error = 'Invalid phone number';
        } else  {
          setErrorMain('')
        }
        break;
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else if (!validatePhoneNumber(value)) {
          error = 'Invalid phone number';
        } else {
          setErrorMain('')
        }
        break;
      case 'pincode':
        if (!value) error = 'Pincode is required';
        else if (!validatePincode(value)) {
          error = 'Invalid pincode';
        } else if (value.length !== 6) {
          error = 'Invalid pincode. Please enter 6 digits.';
        } else {
          setErrorMain('')
        }
        break;
      case 'website':
        if (value && !validateURL(value)) { error = 'Invalid URL' } else { setErrorMain('') };
        break;
      case 'socialMedia':
        if (value && !validateURL(value)) { error = 'Invalid URL' } else { setErrorMain('') };
        break;
      case 'email':
        // if (!value) error = 'Email is required';
        // else
         if (value && !validateEmail(value)) {
          error = 'Invalid email'
        } else {
          setErrorMain('')
        };
        break;
      case 'specialties':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = 'Specialties are required';
        } else {
          setErrorMain('')
        };
        break;
      case 'facilities':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = 'Facilities are required';
        } else {
          setErrorMain('')
        };
        break;
      case 'accessibility':
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = 'Accessibility features are required';
        } else {
          setErrorMain('')
        };
        break;
      case 'address':
        if (!value) {
          error = 'Address is required';
        } else {
          setErrorMain('')
        };
        break;
      // case 'description':
      //   if (!value) {
      //     error = 'Description is required';
      //   } else {
      //     setErrorMain('')
      //   };
      //   break;
      case 'city':
        if (!value) {
          error = 'City is required';
        } else {
          setErrorMain('')
        };
        break;
      case 'area':
        if (!value) {
          error = 'Area is required';
        } else {
          setErrorMain('')
        };
        break;
      case 'latitude':
        if (!value) {
          error = 'Latitude is required';
        } else {
          setErrorMain('')
        };
        break;
      case 'longitude':
        if (!value) {
          error = 'Longitude is required';
        } else {
          setErrorMain('')
        };
        break;
      case 'mapLink':
        // if (!value) error = 'Google Map link is required';
        // else
         if (value && !validateURL(value)) error = 'Invalid URL';
        break;

      case 'insuranceAccepted':
        if (formData.insuranceAccepted && !validateInsuranceAccepted(value)) error = 'At least one insurance name is required';
        break;
      case 'KeyWords':
        if (!validateKeyWords(value)) error = 'At least one keyword is required';
        if (value.length > 20) error = "There should be less than 20 KeyWords";
        break;
      default:
        setErrorMain('')
        break;
    }
    return error;
  };

  const handleValidation = () => {
    const fieldsToValidate = [
      { name: 'name', value: hospitalData.name },
      { name: 'alternateNumber', value: fetchedDetails.contact.alternateNumber },
      { name: 'phoneNumber', value: hospitalData.phoneNumber },
      { name: 'pincode', value: hospitalData.pincode },
      { name: 'website', value: fetchedDetails.contact.website },
      { name: 'socialMedia', value: fetchedDetails.contact.socialMedia },
      { name: 'email', value: fetchedDetails.contact.email },
      // { name: 'description', value: fetchedDetails.profile.description },
      { name: 'address', value: fetchedDetails.location.address },
      { name: 'city', value: hospitalData.city },
      { name: 'area', value: hospitalData.area },
      { name: 'latitude', value: hospitalData.latitude },
      { name: 'longitude', value: hospitalData.longitude },
      { name: 'mapLink', value: hospitalData.mapLink },
      { name: 'insuranceAccepted', value: fetchedDetails.insurance.insuranceNames },
      { name: 'KeyWords', value: hospitalData.KeyWords },
    ];

    let newErrors = {};
    let formData = {
      insuranceAccepted: fetchedDetails.insurance.insuranceAccepted,
      emergencyServices: hospitalData.emergencyServices,
    };

    fieldsToValidate.forEach(field => {
      const error = validateField(field.name, field.value, formData);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      return true;
    } else {
      setErrors(newErrors);
      return false;
    }
  };


  const validateInsuranceAccepted = (value) => {
    return Array.isArray(value) && value.length > 0;
  };

  const validateKeyWords = (value) => {
    return Array.isArray(value) && value.length > 0;
  };

  const handleAddInsurance = (e) => {
    if (e.key === 'Enter' && insuranceInput.trim() !== '') {
      handleDetailChange('insurance', 'insuranceNames', [...fetchedDetails.insurance.insuranceNames, insuranceInput.trim()]);
      setInsuranceInput('');
    }
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && KeyWordsName.trim() !== '') {
      const name = KeyWordsName.toLowerCase().trim();

      handleFieldChange('KeyWords', [...hospitalData.KeyWords, name]);
      setKeyWordsName('');
    }
  };

  const handleDetailChange = (section, field, value) => {
    setFetchedDetails(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value
      }
    }));
  };

  const handleChange = (setter, section, field) => (e) => {
    const value = e.target.value;
    setter((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleChangeData = (setter, field) => (e) => {
    const value = e.target.value;
    setter((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handleRadioChange = (e) => {
    const value = e.target.value === 'yes';
    setFetchedDetails(prevDetails => ({
      ...prevDetails,
      insurance: {
        ...prevDetails.insurance,
        insuranceAccepted: value
      }
    }));
  };

  const handleFieldChange = (field, value) => {
    setHospitalData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const validatePhoneNumber = (value) => {
    const phoneNumberRegex = /^[0-9]{0,20}$/;
    return phoneNumberRegex.test(value) ? value : hospitalData.phoneNumber;
  };

  const validatePincode = (value) => {
    const pincodeRegex = /^[0-9]{0,6}$/;
    return pincodeRegex.test(value) ? value : hospitalData.pincode;
  };

  const validateURL = (value) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\S*$/;
    return urlRegex.test(value) ? value : '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleDeleteInsurance = (index) => {
    setFetchedDetails(prevState => ({
      ...prevState,
      insurance: {
        ...prevState.insurance,
        insuranceNames: prevState.insurance.insuranceNames.filter((_, i) => i !== index),
      }
    }));
  };

  const handleDeleteKeyword = (index) => {
    setHospitalData(prevState => ({
      ...prevState,
      KeyWords: prevState.KeyWords.filter((_, i) => i !== index),
    }));
  };

  const [isDisabled, setIsDisabled] = useState(true);
  const handleEdit = (e) => {
    setIsDisabled(false)
  }
  const handleCancel = (e) => {
    window.location.reload();
  }
  const handleSave = (e) => {
    const errors = handleValidation();
    if (errors && Object.keys(errors).length === 0) {
      setErrorMain('');
      setPopUp(true);
      setIsDisabled(true);
    } else {
      setErrorMain('*Fill all required fields and try again.');
      setSnackbarMessage("Error check validations.");
      setSnackbarColor('error');
      setSnackbarOpen(true);
    }
  }
  const handleMultiSelectChange = (setter, section, field) => (e) => {
    const value = e.target.value;
    setter((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [field]: value,
      },
    }));
    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };
  const handleSubmit = async () => {

    const BasicDetail = {
      name: hospitalData.name,
      specialties: hospitalData.specialties,
      pincode: hospitalData.pincode,
      area: hospitalData.area,
      longitude: hospitalData.longitude,
      latitude: hospitalData.latitude,
      KeyWords: hospitalData.KeyWords,
      service_type: 'pharmacy',
      isPublished: hospitalData.isPublished,
      isActive: hospitalData.isActive,
      image: images,
      city: hospitalData.city,
      mapLink: hospitalData.mapLink,
      phoneNumber: hospitalData.phoneNumber,
      emergencyServices: hospitalData.emergencyServices,
    }

    const details = {
      profile: {
        description: fetchedDetails.profile.description,
      },
      location: {
        address: fetchedDetails.location.address,
      },

      contact: {
        alternateNumber: fetchedDetails.contact.alternateNumber,
        email: fetchedDetails.contact.email,
        website: fetchedDetails.contact.website,
        socialMedia: fetchedDetails.contact.socialMedia,
      },
      insurance: {
        insuranceAccepted: fetchedDetails.insurance.insuranceAccepted,
        insuranceNames: fetchedDetails.insurance.insuranceNames
      }
    }

    try {
      setErrorMain('');
      await updatePharmacy(state.id, BasicDetail, details);
      setSnackbarMessage("Pharmacy details saved successfully!");
      setSnackbarColor('success');
      setSnackbarOpen(true);
      setPopUp(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setErrorMain('*Fill all required fields and try again.');
      setSnackbarMessage("Error check validations.");
      setSnackbarColor('error');
      setSnackbarOpen(true);
      setSnackbarOpen(true);
    }
  };
  const {
    cityList,
    areaList,
    insurance
  } = useDropdown();
  const hospitalProfileFields = [
    [
      {
        name: 'Name',
        placeholder: 'Enter hospital name',
        type: 'text',
        value: hospitalData.name,
        onChange: handleChangeData(setHospitalData, 'name'),
        required: true,
        error: !!errors.name,
        helperText: errors.name,
        disabled: isDisabled
      },
      {
        name: 'Description',
        placeholder: 'Enter Descritpion',
        disabled: isDisabled,
        type: 'text',
        value: fetchedDetails?.profile?.description,
        onChange: handleChange(setFetchedDetails, 'profile', 'description'),
        multiline: true,
        minRows: 10,
        required: false,
        error: !!errors.description,
        helperText: errors.description,
      },
    ],

  ];

  const contactDetailsFields = [
    [
      {
        name: 'Phone No',
        placeholder: 'Enter Phone Number',
        type: 'number',
        value: hospitalData.phoneNumber,
        disabled: isDisabled,
        required: true,
        onChange: handleChangeData(setHospitalData, 'phoneNumber'),

        error: !!errors.phoneNumber,
        helperText: errors.phoneNumber,
      },
      {
        name: 'Emergency Phone No',
        placeholder: 'Enter Emergency Number',
        type: 'number',
        value: fetchedDetails?.contact?.alternateNumber,
        onChange: handleChange(setFetchedDetails, 'contact', 'alternateNumber'),
        disabled: isDisabled,

        required: true,
        error: !!errors.alternateNumber,
        helperText: errors.alternateNumber,
      },
    ],
    [
      {
        name: 'Website',
        placeholder: 'Enter Website URL',
        type: 'url',
        value: fetchedDetails?.contact?.website,
        onChange: handleChange(setFetchedDetails, 'contact', 'website'),
        disabled: isDisabled,
        required: false,
        error: !!errors.website,
        helperText: errors.website,
      },
      {
        name: 'Email',
        placeholder: 'Enter Email Address',
        disabled: isDisabled,
        type: 'email',
        value: fetchedDetails?.contact?.email,
        onChange: handleChange(setFetchedDetails, 'contact', 'email'),

        required: false,
        error: !!errors.email,
        helperText: errors.email,
      }
    ],
    [
      {
        name: 'Social Media',
        placeholder: 'Enter Social Media URL',
        type: 'url',
        value: fetchedDetails?.contact?.socialMedia,
        onChange: handleChange(setFetchedDetails, 'contact', 'socialMedia'),
        disabled: isDisabled,
        required: false,
        error: !!errors.socialMedia,
        helperText: errors.socialMedia,
      },
    ]
  ];

  const locationDetailsFields = [
    [
      {
        name: 'Address',
        placeholder: 'Enter Address',
        disabled: isDisabled,
        type: 'text',
        value: fetchedDetails?.location?.address,
        onChange: handleChange(setFetchedDetails, 'location', 'address'),
        multiline: true,
        minRows: 5,
        required: true,
        error: !!errors.address,
        helperText: errors.address,
      },
      {
        name: 'City',
        placeholder: 'Enter City',
        type: 'dropdown',
        Items: cityList,
        id: 'city',
        multiple: false,
        isSelectAll: false,
        value: hospitalData.city,
        onChange: handleChangeData(setHospitalData, 'city'),
        disabled: isDisabled,
        required: true,
        error: !!errors.city,
        helperText: errors.city,
      },
    ],
    [
      {
        name: 'Area',
        placeholder: 'Enter Area',
        type: 'dropdown',
        value: hospitalData.area,
        Items: areaList[hospitalData.city] || [],
        multiple: false,
        isSelectAll: false,
        onChange: handleChangeData(setHospitalData, 'area'),
        isEmpty: !hospitalData.city,
        required: true,
        disabled: isDisabled,
        error: !!errors.area,
        helperText: errors.area,
      },
      {
        name: 'Pincode',
        placeholder: 'Enter Pincode',
        disabled: isDisabled,
        type: 'number',
        value: hospitalData.pincode,
        onChange: handleChangeData(setHospitalData, 'pincode'),
        required: true,
        error: !!errors.pincode,
        helperText: errors.pincode,
      }
    ],
    [
      {
        name: 'Latitude',
        placeholder: 'Enter Latitude',
        disabled: isDisabled,
        type: 'number',
        value: hospitalData.latitude,
        onChange: handleChangeData(setHospitalData, 'latitude'),
        required: true,
        error: !!errors.latitude,
        helperText: errors.latitude,
      },
      {
        name: 'Longitude',
        placeholder: 'Enter Longitude',
        disabled: isDisabled,
        type: 'number',
        value: hospitalData.longitude,
        onChange: handleChangeData(setHospitalData, 'longitude'),
        required: true,
        error: !!errors.longitude,
        helperText: errors.longitude,
      },
    ],
    [
      {
        name: 'Google Map Link',
        placeholder: 'Enter Google Map URL',
        disabled: isDisabled,
        type: 'url',
        value: hospitalData.mapLink,
        onChange: handleChangeData(setHospitalData, 'mapLink'),

        required: false,
        error: !!errors.mapLink,
        helperText: errors.mapLink,
      },
    ]
  ];

  const aboutDetailsFields = [
    [

      {
        name: "Emergency Services(24*7)",
        type: "radio",
        value: hospitalData?.emergencyServices ? 'yes' : 'no',
        onChange: (e) => handleRadioChangeemer(e, setHospitalData, 'emergencyServices'),
        required: true,
        radioOptions: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
        disabled: isDisabled
      }
    ]
  ];

  const Insurance = [
    [{
      name: "Insurance Accepted",
      type: "radio",
      value: fetchedDetails?.insurance.insuranceAccepted ? 'Yes' : 'No',
      onChange: (e) => handleRadioChange(e),
      required: true,
      radioOptions: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ],
      disabled: isDisabled
    }],
    fetchedDetails?.insurance?.insuranceAccepted ? [{
      name: 'Insurance Name',
      placeholder: 'Enter the Insurance Name',
      disabled: isDisabled,
      value: fetchedDetails.insurance.insuranceNames,
      Items: insurance,
      handleDeleteItem: (index) => handleDeleteInsurance(index),
      required: true,
      error: !!errors.insuranceAccepted,
      helperText: errors.insuranceAccepted,
      type: 'dropdown',
      multiple: true,
      isSelectAll: true,
      multiSelectedItems: fetchedDetails?.insurance?.insuranceNames,
      onChange: handleMultiSelectChange(setFetchedDetails, 'insurance', 'insuranceNames'),
    }] : []
  ];

  const Keyword = [
    [{
      name: 'KeyWords',
      placeholder: 'Enter the KeyWords',
      disabled: isDisabled,
      type: 'multiInput',
      inputValue: KeyWordsName,
      setInputValue: setKeyWordsName,
      value: hospitalData?.KeyWords,
      handleAddItem: handleAddKeyword,
      Items: hospitalData?.KeyWords || [],  // Ensure items is always an array
      handleDeleteItem: (index) => handleDeleteKeyword(index),
      required: true,
      error: !!errors.KeyWords,
      helperText: errors.KeyWords,
    }]
  ];
  const handleRadioChangeemer = (e, setter, field) => {
    const value = e.target.value === 'yes';
    setter((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSwitchChange = () => {
    setHospitalData(prevState => ({
      ...prevState,
      isPublished: !prevState.isPublished
    }));
  };

  const handleSwitchActive = () => {
    setHospitalData(prevState => ({
      ...prevState,
      isActive: !prevState.isActive
    }));
  };

  return (
    <div  style={{ maxWidth: 'calc(100% - 3px)' ,resize:'both' }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {loading && <Loading />}
      <Card width='100%' style={{ marginLeft: 40, marginRight: 80, marginTop: 20, marginBottom: 20 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display='flex' alignItems='center'>
            <Tooltip title="Back to pharmacy">
              <IconButton onClick={handleBackHospitalClick} sx={{ mt: 1, ml: 1.5, mb: 1 }}>
                <ArrowBackRoundedIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" ml={1}>
              View Pharmacy Detail
            </Typography>
            <Stack direction="row" alignItems="center">
              <Box ml={2}>
                <Switch
                  disabled={isDisabled}
                  checked={hospitalData.isActive}
                  onChange={handleSwitchActive}
                  inputProps={{ 'aria-label': 'ant design' }}
                />
                <Typography variant='button' fontSize={15}>Active</Typography>
                <Tooltip title="Deactivate if the service is temporarily unavailable. Out of service message will be displayed on this service in Medblik App.">
                  <IconButton >
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box ml={2}>
                <Switch

                  disabled={isDisabled}
                  checked={hospitalData.isPublished}
                  onChange={handleSwitchChange}
                  inputProps={{ 'aria-label': 'ant design' }}
                />
                <Typography variant='button' fontSize={15}>Publish</Typography>
                <Tooltip title="Once Published the service will be live on Medblik Mobile app.">
                  <IconButton >
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
          </Box>
          <Typography color='error' ml={2} alignContent={'center'}>{errorMain}</Typography>
          <Box display='flex' alignItems='center'>
            {isDisabled ? (<Button onClick={handleEdit} color="primary" variant="contained" sx={{ ml: 2, mr: 2 }}>Edit</Button>) :
              (<><Button onClick={handleCancel} color='error' variant='outlined'>cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained" sx={{ ml: 2, mr: 2 }}>Save</Button></>)}
          </Box>
        </Box>
      </Card>

      <FormSection title="Profile" fields={hospitalProfileFields} />
      <DraggableList
        items={images || []}
        length={images?.length || 0}
        setItems={(newItems) => setImages(newItems)}
        setLoading={setLoading}
        id={state.id}
        disabled={isDisabled}
      />
      <FormSection title="Location Details" fields={locationDetailsFields} />
      <FormSection title="About" fields={aboutDetailsFields} />

      <FormSection title="Contact Details" fields={contactDetailsFields} />
      <FormSection title='Insurance' fields={Insurance} />

      <FormSection title="Keywords" fields={Keyword} />


      {popUp && (
        <PopUp
          open={popUp}
          onClose={() => setPopUp(false)}
          submitText={"Update"}
          loading={loading}
          Title={'Are you sure?'}
          savetitle={'Save'}
          closetitle={"Close"}
          onSubmit={handleSubmit}
          icon={<InfoOutlinedIcon sx={{ fontSize: 22 }} />}
          color={'success'}
          description={"The following details will be added"}
        />
      )}
    </div>
  );
}

export default ViewPharmacy;
