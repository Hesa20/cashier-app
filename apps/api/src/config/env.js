/**
 * Environment Variable Validator
 * Validates required environment variables on server startup
 */

const validateEnv = () => {
  const requiredVars = ['PORT', 'HOST'];
  
  // Additional requirements for production
  if (process.env.NODE_ENV === 'production') {
    requiredVars.push('FRONTEND_URL');
  }
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 Please check your .env file\n');
    process.exit(1);
  }
  
  // Validate PORT is a number
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error(`❌ Invalid PORT value: ${process.env.PORT}`);
    console.error('   PORT must be a number between 1 and 65535\n');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
};

module.exports = { validateEnv };
