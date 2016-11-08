# Using with Rails

*Note: These instructions describe setting up the alpha version of govuk_frontend_toolkit*

## Add to Gemfile

From this repo build a local version of the gem:

```bash
gulp package
```

This will create a gem in `dist/gem`, which you can reference from your app's Gemfile.

```ruby
gem 'govuk_frontend_alpha', path: '../govuk_frontend_alpha/dist/gem'
```

Make sure you update the `path:` value to point to the correct place, if your path is different.

## Use the layout

Add this line to the bottom of your application layout view (usually in `app/views/layouts/application.html.erb`):

```erb
<%= render file: 'layouts/govuk_template' %>
```

## Importing SASS

application.css or scss?

In your

## Customise the template

`govuk_template` provides blocks you can insert content into, to customise the basic layout.

For example, to set a `<title>` for your page you can set content for the `:page_title` block, and it will be inserted into the `govuk_template` layout.:

```
<% content_for :page_title, "My page title" %>
```

Or to add content to `<head>`, for stylesheets or similar:

```
<% content_for :head do %>
  <%= stylesheet_link_tag 'application', media: 'all' %>
  <%= csrf_meta_tags %>
<% end %>
```

Check out the [full list of blocks](template-blocks.md) you can use to customise the template.
