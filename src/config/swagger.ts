export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "MoveInBD REST API 🏠🚚",
    version: "1.0.0",
    description: "MoveInBD — Housing, Logistics & Transport Platform REST API. Powers property rentals, house-shifting logistics, transport fleet bookings, and mess utility bill management.",
  },
  servers: [
    {
      url: "/",
      description: "Current Host (Auto-detected)"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>"
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          role: { type: "string", enum: ["TENANT_USER", "PROVIDER", "ADMIN"] },
          isVerified: { type: "boolean" },
          avatar: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Property: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
          area: { type: "string" },
          propertyType: { type: "string", enum: ["FLAT", "SUBLET", "MESS"] },
          rentAmount: { type: "number" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          isAvailable: { type: "boolean" },
          landlordId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UtilityBill: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          propertyId: { type: "string", format: "uuid" },
          month: { type: "string" },
          year: { type: "integer" },
          electricityBill: { type: "number" },
          gasBill: { type: "number" },
          waterBill: { type: "number" },
          maidSalary: { type: "number" },
          totalAmount: { type: "number" },
          perTenantShare: { type: "number" },
          status: { type: "string", enum: ["UNPAID", "PARTIALLY_PAID", "PAID"] },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Vehicle: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          vehicleType: { type: "string", enum: ["PICKUP_TRUCK", "COVERED_VAN", "PASSENGER_CAR", "MICROBUS"] },
          licensePlate: { type: "string" },
          capacity: { type: "string" },
          driverName: { type: "string" },
          driverPhone: { type: "string" },
          hourlyRate: { type: "number" },
          perKmRate: { type: "number" },
          isAvailable: { type: "boolean" },
          ownerId: { type: "string", format: "uuid" }
        }
      },
      TransportBooking: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          tenantId: { type: "string", format: "uuid" },
          vehicleId: { type: "string", format: "uuid" },
          bookingType: { type: "string", enum: ["HOUSE_SHIFTING", "PASSENGER_TRAVEL"] },
          pickupAddress: { type: "string" },
          dropoffAddress: { type: "string" },
          shiftingDate: { type: "string", format: "date-time" },
          laborCount: { type: "integer" },
          totalAmount: { type: "number" },
          escrowStatus: { type: "string", enum: ["HELD", "RELEASED", "REFUNDED"] },
          status: { type: "string", enum: ["PENDING", "ACCEPTED", "IN_TRANSIT", "COMPLETED", "CANCELLED"] }
        }
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          amount: { type: "number" },
          paymentType: { type: "string", enum: ["RENT", "UTILITY", "TRANSPORT_BOOKING"] },
          referenceId: { type: "string" },
          gateway: { type: "string", enum: ["STRIPE", "SSLCOMMERZ"] },
          transactionId: { type: "string" },
          status: { type: "string", enum: ["INITIATED", "SUCCESS", "FAILED", "CANCELLED"] }
        }
      }
    }
  },
  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Tanvir Ahmed" },
                  email: { type: "string", example: "tenant@moveinbd.com" },
                  password: { type: "string", example: "admin123456" },
                  phone: { type: "string", example: "+8801700000000" },
                  role: { type: "string", enum: ["TENANT_USER", "PROVIDER", "ADMIN"], example: "TENANT_USER" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "User registered successfully" } }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login user & obtain JWT tokens",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "tenant@moveinbd.com" },
                  password: { type: "string", example: "admin123456" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "User logged in successfully" } }
      }
    },
    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh user access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: { type: "string" }
                }
              }
            }
          }
        },
        responses: { "200": { description: "New access token generated" } }
      }
    },
    "/api/v1/users/me": {
      get: {
        tags: ["Users & Profile"],
        summary: "Get current authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Profile retrieved successfully" } }
      },
      patch: {
        tags: ["Users & Profile"],
        summary: "Update current user profile",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Profile updated successfully" } }
      }
    },
    "/api/v1/users/{id}": {
      get: {
        tags: ["Users & Profile"],
        summary: "Get user details by ID (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User retrieved successfully" } }
      },
      delete: {
        tags: ["Users & Profile"],
        summary: "Delete user account (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "User deleted successfully" } }
      }
    },
    "/api/v1/users/{id}/role": {
      patch: {
        tags: ["Users & Profile"],
        summary: "Update user role (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["role"],
                properties: {
                  role: { type: "string", enum: ["TENANT_USER", "PROVIDER", "ADMIN"] }
                }
              }
            }
          }
        },
        responses: { "200": { description: "User role updated successfully" } }
      }
    },
    "/api/v1/properties": {
      get: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Search & filter property listings",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" }, description: "Search query keyword" },
          { name: "city", in: "query", schema: { type: "string" }, description: "Filter by city" },
          { name: "propertyType", in: "query", schema: { type: "string", enum: ["FLAT", "SUBLET", "MESS"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: { "200": { description: "Properties retrieved successfully" } }
      },
      post: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Create property listing (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Property created successfully" } }
      }
    },
    "/api/v1/properties/search": {
      get: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Search properties by query string",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search keyword" }
        ],
        responses: { "200": { description: "Properties search results retrieved" } }
      }
    },
    "/api/v1/properties/{id}": {
      get: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Get property details by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Property details retrieved" } }
      },
      patch: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Update property details (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Property updated successfully" } }
      },
      delete: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Soft delete property (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Property deleted successfully" } }
      }
    },
    "/api/v1/utilities": {
      get: {
        tags: ["Utilities & Bill Splitting"],
        summary: "List all utility bills (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "All utility bills retrieved" } }
      },
      post: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Create monthly utility bill & tenant split (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Utility bill created successfully" } }
      }
    },
    "/api/v1/utilities/my-bills": {
      get: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Get user utility bill invoices",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Utility bills retrieved successfully" } }
      }
    },
    "/api/v1/utilities/{id}": {
      get: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Get utility bill details by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Utility bill details retrieved" } }
      },
      patch: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Update utility bill details (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Utility bill updated" } }
      },
      delete: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Delete utility bill (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Utility bill deleted" } }
      }
    },
    "/api/v1/utilities/{id}/pay": {
      patch: {
        tags: ["Utilities & Bill Splitting"],
        summary: "Mark tenant utility share as paid (Tenant)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Tenant utility share marked paid" } }
      }
    },
    "/api/v1/vehicles": {
      get: {
        tags: ["Vehicles & Transport"],
        summary: "Browse transport vehicles (Pickup trucks, vans, cars, microbuses)",
        parameters: [
          { name: "vehicleType", in: "query", schema: { type: "string", enum: ["PICKUP_TRUCK", "COVERED_VAN", "PASSENGER_CAR", "MICROBUS"] } }
        ],
        responses: { "200": { description: "Vehicles retrieved successfully" } }
      },
      post: {
        tags: ["Vehicles & Transport"],
        summary: "Add new vehicle to transport fleet (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Vehicle added successfully" } }
      }
    },
    "/api/v1/vehicles/{id}": {
      get: {
        tags: ["Vehicles & Transport"],
        summary: "Get vehicle details by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Vehicle details retrieved" } }
      },
      patch: {
        tags: ["Vehicles & Transport"],
        summary: "Update vehicle details (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Vehicle updated" } }
      },
      delete: {
        tags: ["Vehicles & Transport"],
        summary: "Soft delete vehicle (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Vehicle deleted" } }
      }
    },
    "/api/v1/bookings": {
      get: {
        tags: ["Bookings & Shifting"],
        summary: "List all system bookings (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "All bookings retrieved" } }
      },
      post: {
        tags: ["Bookings & Shifting"],
        summary: "Create house-shifting or travel booking with escrow hold",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Booking created successfully" } }
      }
    },
    "/api/v1/bookings/my-bookings": {
      get: {
        tags: ["Bookings & Shifting"],
        summary: "View logged-in user booking history",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "User bookings retrieved" } }
      }
    },
    "/api/v1/bookings/{id}": {
      get: {
        tags: ["Bookings & Shifting"],
        summary: "Get booking details by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Booking details retrieved" } }
      },
      delete: {
        tags: ["Bookings & Shifting"],
        summary: "Cancel / delete booking",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Booking deleted" } }
      }
    },
    "/api/v1/bookings/{id}/status": {
      patch: {
        tags: ["Bookings & Shifting"],
        summary: "Update booking & escrow status",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["PENDING", "ACCEPTED", "IN_TRANSIT", "COMPLETED", "CANCELLED"] }
                }
              }
            }
          }
        },
        responses: { "200": { description: "Booking status updated" } }
      }
    },
    "/api/v1/payments": {
      get: {
        tags: ["Payments Gateway"],
        summary: "List all payment transaction records (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "All payments retrieved" } }
      }
    },
    "/api/v1/payments/stripe/create-checkout-session": {
      post: {
        tags: ["Payments Gateway"],
        summary: "Create a real Stripe Checkout payment session",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount", "paymentType", "referenceId"],
                properties: {
                  amount: { type: "number", example: 3500 },
                  paymentType: { type: "string", enum: ["RENT", "UTILITY", "TRANSPORT_BOOKING"], example: "TRANSPORT_BOOKING" },
                  referenceId: { type: "string", example: "booking_id_uuid" },
                  successUrl: { type: "string", example: "http://localhost:3000/success" },
                  cancelUrl: { type: "string", example: "http://localhost:3000/cancel" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Stripe checkout session created successfully" } }
      }
    },
    "/api/v1/payments/stripe/webhook": {
      post: {
        tags: ["Payments Gateway"],
        summary: "Stripe webhook endpoint for signature-verified event notifications",
        description: "Processes checkout.session.completed and payment_intent.succeeded events signed with stripe-signature",
        responses: { "200": { description: "Stripe webhook event processed successfully" } }
      }
    },
    "/api/v1/payments/initiate": {
      post: {
        tags: ["Payments Gateway"],
        summary: "Initiate payment session via Stripe or SSLCommerz",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Payment session initiated" } }
      }
    },
    "/api/v1/payments/webhook": {
      post: {
        tags: ["Payments Gateway"],
        summary: "Process payment gateway webhook callback",
        responses: { "200": { description: "Payment verified successfully" } }
      }
    },

    "/api/v1/payments/{id}": {
      get: {
        tags: ["Payments Gateway"],
        summary: "Get payment transaction by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Payment details retrieved" } }
      }
    },
    "/api/v1/payments/{id}/refund": {
      patch: {
        tags: ["Payments Gateway"],
        summary: "Mark payment transaction as refunded (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Payment refunded" } }
      }
    },
    "/api/v1/admin/dashboard-stats": {
      get: {
        tags: ["Admin Operations"],
        summary: "Get system dashboard analytics & total revenue (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Dashboard stats retrieved" } }
      }
    },
    "/api/v1/admin/users": {
      get: {
        tags: ["Admin Operations"],
        summary: "List all system users (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Users list retrieved" } }
      }
    },
    "/api/v1/admin/providers/{id}/verify": {
      patch: {
        tags: ["Admin Operations"],
        summary: "Approve and verify provider account (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Provider verified" } }
      }
    },
    "/api/v1/admin/audit-logs": {
      get: {
        tags: ["Admin Operations"],
        summary: "View system activity audit trail logs (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Audit logs retrieved" } }
      }
    }
  }
};
