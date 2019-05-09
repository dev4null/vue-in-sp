/**
 * User class
 * This is a data model that describes a User.
 **/

const PLACEHOLDER_PHOTO_URL =
    "https://media.istockphoto.com/vectors/data-placeholder-image-gray-silhouette-no-photo-vector-id1016744076",
  ACCOUNT_NAME_PREFIX = "i:0#.f|membership|",
  UNKNOWN_NAME = "UNKNOWN USER";

export class User {
  /*
    Create User object
    If data is provided, then cast values to this user object
  */
  constructor(data) {
    this.init();
    if (data) this.mapBasicData(data);
  }
  init() {
    this.isLoaded = false;
    this.arePermissionsLoaded = false;

    this.siteID = null;
    this.globalID = null;
    this.name = UNKNOWN_NAME;
    this.email = null;
    this.username = null;
    this.photoUrl = PLACEHOLDER_PHOTO_URL;
    this.profileUrl = null;
    this.rank = null;
    this.linkedInProfileUrl = null;

    this.language = null;
    this.permissions = {};
  }

  /*
    Map basic data to this user object. Formats could be:
      {
        UserIdentity {
          ID = site-specific user ID
          Title = full name
          Name = AD account name / username
          EMail = email
        }
      --or:
        ID = site-specific user ID
        Title = full name
        Name = AD account name / username
      }
  */
  mapBasicData(data) {
    if (data) {
      if (data.UserIdentity) {
        this.siteID = data.UserIdentity.ID;
        this.name = data.UserIdentity.Title;
        this.email = data.UserIdentity.EMail;
        this.username = data.UserIdentity.Name;
      } else if (data.AccountName) {
        this.username = data.AccountName;
        if (data.DisplayName) this.name = data.DisplayName;
        if (data.Email) this.email = data.Email;
        if (data.PictureUrl) this.photoUrl = data.PictureUrl;
        if (data.PersonalUrl) this.profileUrl = data.PersonalUrl;
        if (data.Title) this.rank = data.Title;
      } else {
        this.siteID = data.ID;
        if (data.DisplayName) {
          this.name = data.DisplayName;
          if (data.Title) this.rank = data.Title;
        } else if (data.Title) this.name = data.Title;
        if (data.Name) this.username = data.Name;
      }
      this.isLoaded = true;
    }
  }
  /*
    Map profile data to user object
  */
  mapProfileData(data) {
    if (data) {
      if (data.DisplayName) this.name = data.DisplayName;
      if (
        data.PictureUrl &&
        (!this.photoUrl || this.photoUrl == PLACEHOLDER_PHOTO_URL)
      )
        this.photoUrl = data.PictureUrl;
      if (data.Email) this.email = data.Email;
      if (data.AccountName) this.username = data.AccountName;
      else if (this.email) this.username = ACCOUNT_NAME_PREFIX + this.email;
      if (data.PersonalUrl) this.profileUrl = data.PersonalUrl;
      if (data.Title) this.rank = data.Title;

      this.isLoaded = true;
    }
  }
  /*
    Load full profile
    spc: SharePoint Vue plugin instance (this.$sp)
  */
  loadProfile(spc) {
    return new Promise((resolve, reject) => {
      if (spc && (this.username || this.email)) {
        spc
          .retrievePeopleProfile({
            accountName: this.username,
            email: this.email
          })
          .then(profileData => {
            this.mapProfileData(profileData);
            spc
              .ensureSiteUserId({
                accountName: this.username
              })
              .then(id => {
                this.siteID = id;
                resolve();
              })
              .catch(error => {
                resolve();
              });
          })
          .catch(error => {
            reject(error);
          });
      } else reject("No SharePointConnector provided.");
    });
  }
}
