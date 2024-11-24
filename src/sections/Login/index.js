import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { bgGradient } from '../../theme/css';
import Iconify from '../../components/iconify';
import { AuthContext } from '../../firebase/AuthContext';
import Loading from './../../components/loading/index';


function Login() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError, loading } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter Email");
    } else if (!password.trim()) {
      setError("Enter Password");
    } else{
      await login(email, password);
    }
  };


  return (
    <>
    {loading&&<Loading/>}
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: '/assets/background/overlay_4.jpg',
          }),
          height: 1,
          mt:10
        }}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Card
            sx={{
              p: 5,
              width: 1,
              maxWidth: 420,
            }}
          >
            <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>Sign in</Typography>
            <Stack spacing={3}>
              <TextField name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email address" />
              <TextField
                name="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? password : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <stack>{error && <p style={{ color: 'red' }}>{error}</p>}</stack>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{color: "primary",
                fontWeight: "primary.main",
                
                // bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  color: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                },}}
                disabled={loading}
                onClick={handleClick}
              >
                Login
              </LoadingButton>
            </Stack>
          </Card>
        </Stack>
      </Box>
    </>
  );
}

export default Login;