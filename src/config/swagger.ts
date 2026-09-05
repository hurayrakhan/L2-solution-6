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
        responses: {
          "201": {
            description: "User registered successfully"
          }
        }
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
        responses: {
          "200": {
            description: "User logged in successfully"
          }
        }
      }
    },
    "/api/v1/users/me": {
      get: {
        tags: ["Users & Profile"],
        summary: "Get current authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profile retrieved successfully" }
        }
      },
      patch: {
        tags: ["Users & Profile"],
        summary: "Update current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profile updated successfully" }
        }
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
        responses: {
          "200": { description: "Properties retrieved successfully" }
        }
      },
      post: {
        tags: ["Properties (Housing & Mess)"],
        summary: "Create property listing (Provider/Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "address", "city", "area", "rentAmount"],
                properties: {
                  title: { type: "string", example: "Modern 3 BHK Flat in Mirpur DOHS" },
                  description: { type: "string", example: "Spacious flat with elevator & backup generator" },
                  address: { type: "string", example: "Road 8, Mirpur DOHS" },
                  city: { type: "string", example: "Dhaka" },
                  area: { type: "string", example: "Mirpur" },
                  propertyType: { type: "string", enum: ["FLAT", "SUBLET", "MESS"], example: "FLAT" },
                  rentAmount: { type: "number", example: 32000 }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Property created successfully" }
        }
      }
    },
    "/api/v1/utilities": {
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
    "/api/v1/bookings": {
      post: {
        tags: ["Bookings & Shifting"],
        summary: "Create house-shifting or travel booking with escrow hold",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Booking created successfully" } }
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
    "/api/v1/admin/dashboard-stats": {
      get: {
        tags: ["Admin Operations"],
        summary: "Get system dashboard analytics & total revenue (Admin)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Dashboard stats retrieved" } }
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
