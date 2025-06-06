# User Type and Onboarding Flow Implementation Guide

This document provides an overview of how the user type selection and onboarding flow works in the Chama application.

## User Flow Overview

1. User registers/signs up
2. User is redirected to select a user type (admin or member)
3. Based on the selected user type:
   - Admin: Redirected to create a chama, then to the admin dashboard
   - Member: Redirected to join an existing chama, then to the member dashboard
4. On subsequent logins, user is redirected based on their status:
   - If user type is not selected: Redirect to user type selection
   - If admin but no chama created: Redirect to create chama
   - If member but no chama joined: Redirect to chama list view
   - Otherwise: Redirect to appropriate dashboard

## Using the AuthService

The `AuthService` provides several methods to help manage this flow:

### User Type Management

```typescript
// Update user's type (admin or member)
await AuthService.updateUserType(UserType.ADMIN);

// Get user's current type from server or localStorage
const userType = await AuthService.getUserType();
```

### Onboarding Status

```typescript
// Check onboarding status
const status = AuthService.checkOnboardingStatus();
if (status.needsUserType) {
  // Redirect to user type selection
  navigate("/chose-user");
} else if (status.needsChama) {
  if (status.userType === UserType.ADMIN) {
    // Admin needs to create a chama
    navigate("/create-chama");
  } else {
    // Member needs to join a chama
    navigate("/chama-list-view");
  }
} else {
  // User has completed onboarding
  if (status.userType === UserType.ADMIN) {
    navigate("/admin/chamas/" + localStorage.getItem("activeChamaId"));
  } else {
    navigate("/member/chamas/" + localStorage.getItem("activeChamaId"));
  }
}
```

### Chama Creation and Joining

```typescript
// When an admin creates a chama
AuthService.markChamaCreationComplete(chamaId);

// When a member joins a chama
AuthService.markChamaJoiningComplete(chamaId);
```

## Implementation in Components

### SignIn Component

The sign-in component checks if the user has completed onboarding and redirects accordingly:

```typescript
// After successful login
const status = AuthService.checkOnboardingStatus();
if (status.needsUserType) {
  navigate("/chose-user");
} else if (status.needsChama) {
  // Redirect to create or join chama
} else {
  // Redirect to dashboard
}
```

### CreateChama Component

When an admin successfully creates a chama:

```typescript
// After successful API call to create chama
AuthService.markChamaCreationComplete(data.id);
navigate(`/admin/chamas/${data.id}`);
```

### ChamaListView Component

When a member successfully joins a chama:

```typescript
// After successful API call to join chama
AuthService.markChamaJoiningComplete(chamaId);
navigate(`/member/chamas/${chamaId}`);
```

## LocalStorage Keys

The following localStorage keys are used to manage the user flow:

- `authToken`: User's authentication token
- `userId`: User's ID
- `userType`: User's type (ADMIN or MEMBER)
- `isFirstLogin`: Whether this is the user's first login ("true" or "false")
- `hasCreatedChama`: Whether the admin has created a chama ("true" or "false")
- `hasJoinedChama`: Whether the member has joined a chama ("true" or "false")
- `activeChamaId`: ID of the active chama

