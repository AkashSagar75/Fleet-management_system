const CompanyBasicForm = ({
  data,
  companyTypes,
  onChange,
  onNext,
}) => {

  return (
    <div className="company-card">

      <div className="company-header">

        <h1 className="company-title">
          Your Business Basic Information
        </h1>

        <p className="company-subtitle">
          Enter your basic details to continue onboarding
        </p>

      </div>

      <form className="company-form">

        <div className="form-group">

          <label>
            Company Name
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="company_name"
              placeholder="Enter name"
              value={data.company_name}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Company Type
          </label>

          <div className="input-wrap">

            <select
              name="company_type_id"
              value={data.company_type_id}
              onChange={(event) =>
                onChange("company", event)
              }
            >

              <option value="">
                Select Company Type
              </option>

              {companyTypes.map((type) => (
                <option
                  key={type.id}
                  value={type.id}
                >
                  {type.name}
                </option>
              ))}

            </select>

          </div>

        </div>

        <div className="form-group">

          <label>
            Company Email
          </label>

          <div className="input-wrap">

            <input
              type="email"
              name="email"
              placeholder="Enter company email"
              value={data.email}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Company Number
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={data.phone}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            GST Number
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="gst_nummber"
              placeholder="Enter GST number"
              value={data.gst_nummber}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            PAN Number
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="pan_number"
              placeholder="Enter PAN number"
              value={data.pan_number}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Address
          </label>

          <div className="input-wrap">

            <textarea
              name="address"
              placeholder="Enter address"
              value={data.address}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            City
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="city"
              placeholder="Enter city"
              value={data.city}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            State
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="state"
              placeholder="Enter state"
              value={data.state}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="form-group">

          <label>
            Pin Code
          </label>

          <div className="input-wrap">

            <input
              type="text"
              name="pincode"
              placeholder="Enter pin code"
              value={data.pincode}
              onChange={(event) =>
                onChange("company", event)
              }
            />

          </div>

        </div>

        <div className="role-btns">

          <button
            type="button"
            className="next-btn"
            onClick={onNext}
          >
            Next
          </button>

        </div>

      </form>

    </div>
  );
};

export default CompanyBasicForm;