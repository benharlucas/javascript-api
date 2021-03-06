describe("UserService", function() {
  const LOCATION_ID = 673;
  const USERS = [
    {
      "id": 127,
      "email": "madli@example.com",
      "firstName": "Madli",
      "lastName": "Maasikas",
      "picture": [
        {
          "size": "medium",
          "url": "http://www.google.com"
        }
      ]
    },
    {
      "id": 245,
      "email": "kristjan@example.com",
      "firstName": "Kristjan",
      "lastName": "Kask",
      "picture": [
        {
          "size": "medium",
          "url": "http://www.google.com"
        }
      ]
    }
  ];
  const pictureSizes = { small: 1, medium: 2, large: 3 };
  const pictureSort = (a, b) => pictureSizes[a.size] - pictureSizes[b.size];

  beforeEach(function() {
    if (typeof Qminder === 'undefined') {
      Qminder = this.Qminder;
    }
    if (typeof sinon === 'undefined') {
      sinon = this.sinon;
    }
    Qminder.setKey('EXAMPLE_API_KEY');
    Qminder.setServer('api.qminder.com');

    // Stub ApiBase.request to feed specific data to API
    this.requestStub = sinon.stub(Qminder.ApiBase, 'request');
  });

  afterEach(function() {
    Qminder.ApiBase.request.restore();
  });

  describe("list()", function() {
    beforeEach(function(done) {
      this.requestStub.withArgs(`locations/${LOCATION_ID}/users`).resolves({ data: USERS });

      Qminder.users.list(LOCATION_ID).then(users => {
        this.users = users;
        done();
      });
    });

    it("returns a list of Qminder.User objects", function() {
      const allAreInstances = this.users.reduce((acc, user) => acc && (user instanceof Qminder.User));
      expect(allAreInstances).toBeTruthy();
    });
    it("returns the right user IDs", function() {
      const returnedIds = this.users.map(user => user.id);
      const groundTruth = USERS.map(user => user.id);

      for (let i = 0; i < groundTruth.length; i++) {
        expect(returnedIds[i]).toBe(groundTruth[i]);
      }
    });
    it("returns the right email addresses", function() {
      const returned = this.users.map(user => user.email);
      const groundTruth = USERS.map(user => user.email);

      for (let i = 0; i < groundTruth.length; i++) {
        expect(returned[i]).toBe(groundTruth[i]);
      }
    });
    it("returns the right first names", function() {
      const returned = this.users.map(user => user.firstName);
      const groundTruth = USERS.map(user => user.firstName);

      for (let i = 0; i < groundTruth.length; i++) {
        expect(returned[i]).toBe(groundTruth[i]);
      }
    });
    it("returns the right last names", function() {
      const returned = this.users.map(user => user.lastName);
      const groundTruth = USERS.map(user => user.lastName);

      for (let i = 0; i < groundTruth.length; i++) {
        expect(returned[i]).toBe(groundTruth[i]);
      }
    });
    it("returns the right pictures", function() {
      const returned = this.users.map(user => user.picture).sort(pictureSort);
      const groundTruth = USERS.map(user => user.picture).sort(pictureSort);

      for (let i = 0; i < groundTruth.length; i++) {
        expect(returned[i].url).toBe(groundTruth[i].url);
      }
    });
  });
  describe("create()", function() {
    // Qminder.users.create(userdata)

    it('Sends the user roles as a JSON array', function() {
      const user = new Qminder.User({
        email: 'test@qminder.com',
        firstName: 'Jon',
        lastName: 'Snow',
        roles: [
          {
            type: 'CLERK',
            location: 1234
          },
          {
            type: 'CLERK',
            location: 1235
          }
        ]
      });

      Qminder.users.create(user);
      expect(this.requestStub.calledWith('users/', sinon.match({
        roles: JSON.stringify(user.roles)
      }))).toBeTruthy();
    });
  });
  describe("details()", function() {
    // Qminder.users.details(userId|userEmail)
  });
  describe("remove()", function() {
    // Qminder.users.remove(user)
  });
  describe("addRole()", function() {
    // Qminder.users.addRole(user, role)
  });
  describe("setLines()" , function() {
    it("Works with a list of Line IDs", function() {
      Qminder.users.setLines(123, [1,2,3,4]);
      expect(this.requestStub.calledWith('users/123/lines', sinon.match(JSON.stringify([1,2,3,4])))).toBeTruthy();
    });

    it("Works with a list of Lines", function() {
      const lines = [
        new Qminder.Line({id: 1, name: 'Test', color:'#fff', disabled:false}),
        new Qminder.Line({id: 2, name: 'Test', color:'#fff', disabled:false}),
        new Qminder.Line({id: 3, name: 'Test', color:'#f00', disabled:false}),
      ];

      Qminder.users.setLines(123, lines);
      expect(this.requestStub.calledWith('users/123/lines', sinon.match(JSON.stringify([1,2,3])))).toBeTruthy();
    });

    it("Breaks when trying to use inconsistent types", function() {
      const lines = [
        1,
        new Qminder.Line({id: 2, name: 'Test', color:'#fff', disabled:false}),
        new Qminder.Line({id: 3, name: 'Test', color:'#f00', disabled:false}),
      ];
      expect(() => Qminder.users.setLines(123, lines)).toThrow();
    });
  });
});
