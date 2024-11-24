import React, { useState } from 'react';
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
import { FormSection, TextAndTextarea } from '../../../_mock/components';
import DraggableList from './dragable';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PopUp from '../../../components/popup';
import Loading from '../../../components/loading';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLabTestContext } from '../../../firebase/LabTestService';
import { useDropdown } from '../../../firebase/DropdownService';

function AddClinic() {
  const router = useRouter();
  const handleBackClinicClick = () => {
    router.push('/labcenter');
  };
  const { addLabTest, loading } = useLabTestContext();
  const [name, setName] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [insuranceAccepted, setInsuranceAccepted] = useState(false);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [emergencyServices, setEmergencyServices] = useState(false);
  const [description, setDescription] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMain, setErrorMain] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');
  const [insuranceNames, setInsuranceNames] = useState([]);
  const [insuranceInput, setInsuranceInput] = useState('');
  const [KeyWords, setKeyWords] = useState([]);
  const [keyWordsName, setKeyWordsName] = useState('');
  const [switchState, setSwitchState] = useState(false);
  const [switchStateActive, setSwitchStateActive] = useState(false);
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value) error = 'Lab Center name is required';
        break;
      case 'alternateNumber':
        if (!value) error = 'Phone number is required';
        else if (!validatePhoneNumber(value)) {
          error = 'Invalid phone number';
        } 
        break;
      case 'phoneNumber':
        if (!value) error = 'Phone number is required';
        else if (!validatePhoneNumber(value)) {
          error = 'Invalid phone number';
        } 
        break;
      case 'pincode':
        if (!value) error = 'Pincode is required';
        else if (!validatePincode(value)) {
          error = 'Invalid pincode';
        }else if (value.length !== 6) {
          error = 'Invalid pincode. Please enter 6 digits.';
        }
        break;
      // case 'description':
      //   if (!value) error = 'Description is required';
      //   break;
      case 'email':
        
          if (value && !validateEmail(value)) error = 'Invalid email';
        break;
      case 'specialties':
        if (!value || (Array.isArray(value) && value.length === 0)) error = 'Specialties are required';
        break;
      case 'facilities':
        if (!value || (Array.isArray(value) && value.length === 0)) error = 'Facilities are required';
        break;
      case 'accessibility':
        if (!value || (Array.isArray(value) && value.length === 0)) error = 'Accessibility features are required';
        break;
      case 'servicesProvided':
        if (!value || (Array.isArray(value) && value.length === 0)) error = 'Services provided are required';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'area':
        if (!value) error = 'Area is required';
        break;
      case 'latitude':
        if (!value) error = 'Latitude is required';
        break;
      case 'longitude':
        if (!value) error = 'Longitude is required';
        break;
      case 'mapLink':
        // if (!value) error = 'Google Map link is required';
        // else 
        if (value && !validateURL(value)) error = 'Invalid URL';
        break;
      case 'socialMedia':
        if (value && !validateURL(value)) error = 'Invalid URL';
        break;
      case 'website':
        if (value && !validateURL(value)) error = 'Invalid URL';
        break;
      case 'affiliations':
        if (!value) error = 'Affiliations are required';
        break;
      case 'insuranceAccepted':
        if (insuranceAccepted && !validateInsuranceAccepted(value)) error = 'At least one insurance name is required';
        break;
      case 'keywords':
        if (!validateKeywords(value)) error = 'At least one keyword is required';
        if (value.length > 20) error = "There should be less than 20 keywords";
        break;
      default:
        break;
    }
    return error;
  };

  const handleValidation = () => {
    const fieldsToValidate = [
      { name: 'name', value: name },
      { name: 'alternateNumber', value: alternateNumber },
      { name: 'phoneNumber', value: phoneNumber },
      { name: 'pincode', value: pincode },
      { name: 'website', value: website },
      { name: 'email', value: email },
      // { name: 'description', value: description },
      { name: 'facilities', value: facilities },
      { name: 'address', value: address },
      { name: 'city', value: city },
      { name: 'area', value: area },
      { name: 'latitude', value: latitude },
      { name: 'longitude', value: longitude },
      { name: 'mapLink', value: mapLink },
      { name: 'socialMedia', value: socialMedia },
      { name: 'insuranceAccepted', value: insuranceNames },
      { name: 'keywords', value: KeyWords },
    ];

    let newErrors = {};
    let formData = { insuranceAccepted, emergencyServices };

    fieldsToValidate.forEach(field => {
      const error = validateField(field.name, field.value, formData);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const validateInsuranceAccepted = (value) => {
    return Array.isArray(value) && value.length > 0;
  };

  const validateKeywords = (value) => {
    return Array.isArray(value) && value.length > 0;
  };

  const handleAddInsurance = (e) => {
    if (e.key === 'Enter' && insuranceInput.trim() !== '') {
      setInsuranceNames([...insuranceNames, insuranceInput.trim()]);
      setInsuranceInput('');
    }
  };
  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keyWordsName.trim() !== '') {
      const name = keyWordsName.toLowerCase().trim();

      setKeyWords([...KeyWords, name]);
      setKeyWordsName('');
    }
  };
  const handleDeleteInsurance = (index) => {
    setInsuranceNames(insuranceNames.filter((_, i) => i !== index));
  };
  const handleDeleteKeyword = (index) => {
    setKeyWords(KeyWords.filter((_, i) => i !== index));
  };


  const handleRadioChange = (e, setter) => {
    setter(e.target.value === 'yes');
  };

  const handleChange = (setter, name) => (e) => {
    const value = e.target.value;
    setter(value);
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };


  const handleMultiSelectChange = (setter, name) => (e) => {
    const value = e.target.value;
    setter(value);
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSave = (e) => {
    const errors = handleValidation();
    if (Object.keys(errors).length === 0) {
      setPopUp(true);

    } else {
      setErrorMain('*Fill all required fields and try again.');
      setSnackbarMessage("Error check validations.");
      setSnackbarColor('error');
      setSnackbarOpen(true);
    }
  }

  const handleSubmit = async () => {
    const ClinicDetailsMain = {
      image: items,
    };
    const BasicDetail = {
      name,
      pincode,
      area,
      longitude,
      latitude,
      KeyWords,
      city,
      mapLink,
      phoneNumber,
      emergencyServices,

      service_type: 'lab center',
      isPublished: switchState,
      isActive: switchStateActive
    }
    const details = {
      profile: {
        facilities,
        description,
      },
      location: {
        address,
      },
      contact: {
        alternateNumber,
        website,
        email,
        socialMedia
      },
      insurance: {
        insuranceAccepted,
        insuranceNames
      }
    }

    try {
      await addLabTest(ClinicDetailsMain, BasicDetail, details);
      setSnackbarMessage("Lab Center details saved successfully!");
      setSnackbarColor('success');
      setSnackbarOpen(true);
      setPopUp(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e) {
      setSnackbarMessage("Fill all required fields and try again.");
      setSnackbarColor('error');
      setSnackbarOpen(true);
      setSnackbarOpen(true);
    }
  };

  const handleRadioChangeemer = (e, setter) => {
    const value = e.target.value === 'yes';
    setter(value);
    setEmergencyServices(value);
  };
  const validatePhoneNumber = (value) => {
    const phoneNumberRegex = /^[0-9]{0,20}$/;
    return phoneNumberRegex.test(value) ? value : phoneNumber;
  };

  const validatePincode = (value) => {
    const pincodeRegex = /^[0-9]{0,6}$/;
    return pincodeRegex.test(value) ? value : pincode;
  };

  const validateURL = (value) => {
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)\S*$/;
    return urlRegex.test(value) ? value : '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const {
    cityList,
    areaList,
    facilitylist,
    insurance
 } = useDropdown();
  const ClinicProfileFields = [
    [
      {
        name: 'Name',
        placeholder: 'Enter Lab Center name',
        type: 'text',
        value: name,
        onChange: handleChange(setName, 'name'),
        required: true,
        error: !!errors.name,
        helperText: errors.name,
      },
      {
        name: 'Facilities',
        placeholder: 'Enter Facilities',
        type: 'dropdown',
        Items: facilitylist,
        multiple: true,
        value: facilities,
        onChange: handleMultiSelectChange(setFacilities),
        required: true,
        error: !!errors.facilities,
        helperText: errors.facilities,
      },
    ],
    [
      {
        name: 'Description',
        placeholder: 'Enter Description',
        type: 'text',
        value: description,
        onChange: handleChange(setDescription, 'description'),
        multiline: true,
        minRows: 3,
        required: false,
        error: !!errors.description,
        helperText: errors.description,
      },
    ]
  ];

  const contactDetailsFields = [
    [
      {
        name: 'Phone No',
        placeholder: 'Enter Phone Number',
        type: 'number',
        value: phoneNumber,
        required: true,
        onChange: handleChange(setPhoneNumber, 'phoneNumber'),
        error: !!errors.phoneNumber,
        helperText: errors.phoneNumber,
      },
      {
        name: 'Emergency Phone No',
        placeholder: 'Enter Emergency Number',
        type: 'number',
        value: alternateNumber,
        onChange: handleChange(setAlternateNumber, 'alternateNumber'),
        required: true,
        error: !!errors.alternateNumber,
        helperText: errors.alternateNumber,
      },

    ],
    [{
      name: 'Website',
      placeholder: 'Enter Website URL',
      type: 'url',
      value: website,
      onChange: handleChange(setWebsite, 'website'),
      required: false,
      error: !!errors.website,
      helperText: errors.website,
    },
    {
      name: 'Email',
      placeholder: 'Enter Email Address',
      type: 'email',
      value: email,
      onChange: handleChange(setEmail, 'email'),
      required: false,
      error: !!errors.email,
      helperText: errors.email,
    }
    ],
    [{
      name: 'Social Media',
      placeholder: 'Enter Social Media URL',
      type: 'url',
      value: socialMedia,
      onChange: handleChange(setSocialMedia, 'socialMedia'),
      required: false,
      error: !!errors.socialMedia,
      helperText: errors.socialMedia,
    },

    ]
  ];
  const aboutDetalisFields = [
    [
      {
        name: "Working Hours(24*7)",
        type: "radio",
        value: emergencyServices ? 'yes' : 'no',
        onChange: (e) => handleRadioChangeemer(e, setEmergencyServices),
        required: true,
        radioOptions: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ],
      }
    ]
  ]

  const locationDetailsFields = [
    [
      {
        name: 'Address',
        placeholder: 'Enter Address',
        type: 'text',
        value: address,
        onChange: handleChange(setAddress, 'address'),
        multiline: true,
        minRows: 3,
        required: true,
        error: !!errors.address,
        helperText: errors.address,
      },
      {
        name: 'City',
        placeholder: 'Enter City',
        type: 'dropdown',
        value: city,
        Items:cityList,
        multiple:false,
        isSelectAll: false,

        onChange: handleChange(setCity, 'city'),
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
        Items: areaList[city] || [],
        isEmpty: !city,
        multiple:false,
        isSelectAll: false,

        value: area,
        onChange: handleChange(setArea, 'area'),
        required: true,
        error: !!errors.area,
        helperText: errors.area,
      },
      {
        name: 'Pincode',
        placeholder: 'Enter Pincode',
        type: 'number',
        value: pincode,
        onChange: handleChange(setPincode, 'pincode'),
        required: true,
        error: !!errors.pincode,
        helperText: errors.pincode,
      }
    ],
    [
      {
        name: 'Latitude',
        placeholder: 'Enter Latitude',
        type: 'number',
        value: latitude,
        onChange: handleChange(setLatitude, 'latitude'),
        required: true,
        error: !!errors.latitude,
        helperText: errors.latitude,
      },
      {
        name: 'Longitude',
        placeholder: 'Enter Longitude',
        type: 'number',
        value: longitude,
        onChange: handleChange(setLongitude, 'longitude'),
        required: true,
        error: !!errors.longitude,
        helperText: errors.longitude,
      },
    ],
    [
      {
        name: 'Google Map Link',
        placeholder: 'Enter Google Map URL',
        type: 'url',
        value: mapLink,
        onChange: handleChange(setMapLink, 'mapLink'),
        required: false,
        error: !!errors.mapLink,
        helperText: errors.mapLink,
      },

    ]
  ];

  const handleSwitchChange = () => {
    setSwitchState(prevState => !prevState);
  };
  const handleSwitchActive = () => {
    setSwitchStateActive(prevState => !prevState);
  };
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
            <Tooltip title="Back to Lab Center">
              <IconButton onClick={handleBackClinicClick} sx={{ mt: 1, ml: 1.5, mb: 1 }}>
                <ArrowBackRoundedIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" ml={1}>
              Add New Lab Center
            </Typography>
            <Stack direction="row" alignItems="center">
              <Box ml={2}>
                <Switch
                  checked={switchStateActive}
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
                  checked={switchState}
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

            <Button onClick={handleSave} color="primary" variant="contained" sx={{ ml: 2, mr: 3 }}>Save</Button>
          </Box>
        </Box>
      </Card>

      <FormSection title="Profile" fields={ClinicProfileFields} />
      <DraggableList items={items} setItems={setItems} />
      <FormSection title="Location Details" fields={locationDetailsFields} />
      <FormSection title="About" fields={aboutDetalisFields} />
      <FormSection title="Contact Details" fields={contactDetailsFields} />

      <Box sx={{ paddingBottom: 2, ml: 5 }}>
        <Card sx={{ pb: 4, mr: 10, mb: 2 }}>
          <Typography sx={{ ml: 4, mt: 2 }} variant="h6">Insurance</Typography>
          <Divider />
          <Box display="flex" alignItems="center" sx={{ width: 450, mt: 2, px: 2 }}>
            <Typography sx={{ ml: 2, mr: 2, width: '200px' }}>
              Insurance Accepted<span style={{ color: 'red' }}>*</span> :
            </Typography>
            <FormControl component="fieldset" >
              <RadioGroup row value={insuranceAccepted ? 'yes' : 'no'} onChange={(e) => handleRadioChange(e, setInsuranceAccepted)}>
                <Box display='flex' >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
          {insuranceAccepted && <TextAndTextarea
               name='Insurance names'
              //  placeholder='Enter insurance names'
               type='dropdown'
               required={true}
               Items={insurance}
               value={insuranceNames}
               onChange={handleMultiSelectChange(setInsuranceNames)}
               require={true}
               error={errors.insuranceAccepted}
               helperText={errors.insuranceAccepted}
              />}
        </Card>
      </Box>

      <Box sx={{ paddingBottom: 2, ml: 5 }}>
        <Card sx={{ pb: 4, mr: 10, mb: 2 }}>
          <Typography sx={{ ml: 4, mt: 2 }} variant="h6">Keywords</Typography>
          <Divider />
          <Box display="flex" alignItems="center" sx={{ width: 600, mt: 2, px: 2 }}>
            <Typography sx={{ ml: 2, mr: 2, width: '200px' }}>
              Enter Keywords<span style={{ color: 'red' }}>*</span> :
            </Typography>
            <TextField
              placeholder='Enter the keywords'
              value={keyWordsName}
              onChange={(e) => setKeyWordsName(e.target.value)}
              onKeyDown={handleAddKeyword}
              style={{ width: 310 }}
              size="small"
              error={!!errors.keywords}
              helperText={errors.keywords}
            />
          </Box>
          <Box sx={{ ml: 32, mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 950 }}>
            {KeyWords.map((name, index) => (
              <Chip
                key={index}
                label={name}
                onDelete={() => handleDeleteKeyword(index)}
                deleteIcon={<DeleteIcon />}
              />
            ))}
          </Box>
        </Card>
      </Box>
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
    </>
  );
}

export default AddClinic;
